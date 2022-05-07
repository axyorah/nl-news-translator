from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from ..models import Note
from .utils import create_user, create_note

NOTES_LIST_URL = reverse('note-list')
NOTE_DETAIL_URL = lambda pk: f'/api/notes/{pk}/'

NOTE_FIELDS = [
    'id',
    'created',
    'owner',
    'side_a',
    'side_b',
    'tags'
]


class PublicNoteListTests(TestCase):
    """Test note actions that don't require authorization"""

    def setUp(self) -> None:
        self.client = APIClient()
        self.user = create_user(
            username='New Name',
            password='new-pass-123'
        )
        self.note = create_note(
            owner=self.user, side_a='test-note-a', side_b='test-note-b'
        )

    def tearDown(self) -> None:
        self.client = None
        self.user = None
        self.notes = None

    def test_list_notes_nologin_fail(self):
        """test that anonymous user can't see any notes"""
        res = self.client.get(NOTES_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', res.data)        

class PrivateNoteListTests(TestCase):
    """Test note-list actions that require authorization"""

    def setUp(self) -> None:
        self.user1 = create_user(
            username='User1',
            password='user-pass-1'
        )
        self.user2 = create_user(
            username='User2',
            password='user-pass-2'
        )

        self.user1_note1 = create_note(
            owner=self.user1, side_a='user1-note1-a', side_b='user1-note1-b'
        )
        self.user1_note2 = create_note(
            owner=self.user1, side_a='user1-note2-a', side_b='user1-note2-b'
        )
        self.user2_note1 = create_note(
            owner=self.user2, side_a='user2-note1-a', side_b='user2-note1-b'
        )

        self.client = APIClient()
        self.client.force_authenticate(self.user2)

    def test_list_notes_response_ok(self):
        """test that authorized user can see his own notes"""
        res = self.client.get(NOTES_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # res contains all expected fields: note, page, num_pages
        self.assertIn('notes', res.data)
        self.assertIn('page', res.data)
        self.assertIn('num_pages', res.data)

        # default page should be `1`
        self.assertEqual(int(res.data['page']), 1)

    def test_list_notes_response_wrongpage1_ok(self):
        """
        test that authorized user can see his own notes, and 
        note page defaults to 1 if invalid page query string is provided
        """
        res = self.client.get(NOTES_LIST_URL, {'page': 100})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # corrected page should be `1`
        self.assertEqual(int(res.data['page']), 1)

    def test_list_notes_response_wrongpage2_ok(self):
        """
        test that authorized user can see his own notes, and 
        note page defaults to 1 if invalid page query string is provided
        """
        res = self.client.get(NOTES_LIST_URL, {'page': -1})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # corrected page should be `1`
        self.assertEqual(int(res.data['page']), 1)

    def test_list_notes_response_wrongpage3_ok(self):
        """
        test that authorized user can see his own notes, and 
        note page defaults to 1 if invalid page query string is provided
        """
        res = self.client.get(NOTES_LIST_URL, {'page': 'notanumber'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # corrected page should be `1`
        self.assertEqual(int(res.data['page']), 1)

    def test_list_notes_fields_ok(self):
        """test that each note in a list contains expected fields"""
        res = self.client.get(NOTES_LIST_URL)

        self.assertIsInstance(res.data['notes'], list)
        for note in res.data['notes']:
            for field in NOTE_FIELDS:
                self.assertIn(field, note)

    def test_list_notes_unauthorized_fail(self):
        """test that one user can't see other user's notes"""
        res = self.client.get(NOTES_LIST_URL)

        # the amount of notes authored by user2 is correct
        self.assertEqual(len(res.data['notes']), 1)

        # all notes belong to logged in user
        for note in res.data['notes']:
            self.assertEqual(note['owner'], self.user2.id)


class PublicNoteDetailTests(TestCase):
    """Test specific note-related actions that don't require authorization"""

    def setUp(self) -> None:
        self.client = APIClient()
        self.user = create_user(
            username='New Name',
            password='new-pass-123'
        )
        self.note = create_note(
            owner=self.user, side_a='test-note-a', side_b='test-note-b'
        )

    def tearDown(self) -> None:
        self.client = None
        self.user = None
        self.notes = None

    def test_note_access_without_login_fail(self):
        """test that anonymous user cannot access note"""
        res = self.client.get(NOTE_DETAIL_URL(self.note.id))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_note_update_without_login_fail(self):
        """test that anonymous user cannot update note"""
        res = self.client.put(NOTE_DETAIL_URL(self.note.id), {})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_note_delete_without_login_fail(self):
        """test that anonymous user cannot delete note"""
        res = self.client.delete(NOTE_DETAIL_URL(self.note.id))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateNoteDetailTests(TestCase):
    """Test specific note-related actions that require authorization"""

    def setUp(self) -> None:
        self.user1 = create_user(
            username='User1',
            password='user-pass-1'
        )
        self.user2 = create_user(
            username='User2',
            password='user-pass-2'
        )

        self.user1_note1 = create_note(
            owner=self.user1, side_a='user1-note1-a', side_b='user1-note1-b'
        )
        self.user1_note2 = create_note(
            owner=self.user1, side_a='user1-note2-a', side_b='user1-note2-b'
        )
        self.user2_note1 = create_note(
            owner=self.user2, side_a='user2-note1-a', side_b='user2-note1-b'
        )

        self.client = APIClient()
        self.client.force_authenticate(self.user2)

    def tearDown(self) -> None:
        self.client = None
        self.user1 = None
        self.user2 = None
        self.notes1 = None
        self.notes2 = None

    def test_get_own_note_ok(self):
        """test if user can get own note"""
        # recall: user2 is logged in
        res = self.client.get(NOTE_DETAIL_URL(self.user2_note1.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # note should have all required fields
        for field in NOTE_FIELDS:
            self.assertIn(field, res.data)

        # note content should be as expected
        self.assertEqual(res.data['id'], str(self.user2_note1.id))
        self.assertEqual(res.data['side_a'], self.user2_note1.side_a)
        self.assertEqual(res.data['side_b'], self.user2_note1.side_b)

    def test_get_not_own_note_fail(self):
        """test that user cannot get someone else's note"""
        # recall: user2 is logged in
        res = self.client.get(NOTE_DETAIL_URL(self.user1_note1.id))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND) # not 401!

        # no note-specific fields are attached to error message
        for field in NOTE_FIELDS:
            self.assertNotIn(field, res.data)

    def test_add_note_ok(self):
        """test if user can add a note"""
        data = {
            'side_a': 'new-user2-note-a',
            'side_b': 'new-user2-note-b'
        }
        res = self.client.post(NOTES_LIST_URL, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # response contains expected fields
        for field in NOTE_FIELDS:
            self.assertIn(field, res.data)

        # owner is set correctly
        self.assertEqual(res.data['owner'], self.user2.id)

        # note is in db
        note = Note.objects.get(id=res.data['id'])
        self.assertTrue(note is not None)

        # note has correct content
        self.assertEqual(note.side_a, data['side_a'])
        self.assertEqual(note.side_b, data['side_b'])

    def test_add_note_invalid_data_ok(self):
        """
        test that note can be created even if 
        wrong owner is specified or fields are missing
        """
        # recall: user2 is logged in
        data = {
            'owner': self.user1.id
        }
        res = self.client.post(NOTES_LIST_URL, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # check if note's owner is the logged in user
        self.assertEqual(res.data['owner'], self.user2.id)

    def test_update_own_note_ok(self):
        """test that user can update own note"""
        note_id = self.user2_note1.id
        msg = 'i am updated'
        res = self.client.put(NOTE_DETAIL_URL(note_id), {'side_a': msg})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # check if returned note is updated
        self.assertEqual(res.data['side_a'], msg)

        # check if db is udpated
        note = Note.objects.get(id=note_id)
        self.assertTemplateNotUsed(note is not None)
        self.assertEqual(note.side_a, msg)

    def test_update_not_own_note_fail(self):
        """test that user can't update someone else's note"""
        note_id = self.user1_note1.id
        msg = 'i am updated'
        res = self.client.put(NOTE_DETAIL_URL(note_id), {'side_a': msg})
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

        # confirm that note info is not attached to error message
        for field in NOTE_FIELDS + ['notes']:
            self.assertNotIn(field, res.data)

        # confirm that db is not udpated
        note = Note.objects.get(id=note_id)
        self.assertTrue(note is not None)
        self.assertNotEqual(note.side_a, msg)

    def test_delete_own_note_ok(self):
        """test if user can delete own note"""
        # recall: user2 is logged in
        note_id = self.user2_note1.id
        res = self.client.delete(NOTE_DETAIL_URL(note_id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # check if note is deleted from db
        note_exists = Note.objects.filter(id=note_id).exists()
        self.assertFalse(note_exists)

    def test_delete_not_own_note_fail(self):
        """test that user can't delete someone else's note"""
        # recall: user2 is logged in
        note_id = self.user1_note1.id
        res = self.client.delete(NOTE_DETAIL_URL(note_id))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

        # check if note is still in db
        note_exists = Note.objects.filter(id=note_id).exists()
        self.assertTrue(note_exists)
