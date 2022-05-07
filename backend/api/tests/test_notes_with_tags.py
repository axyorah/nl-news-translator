from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from ..models import Note, Tag
from .utils import create_user, create_note, create_tag


NOTES_LIST_URL = reverse('note-list')
NOTE_DETAIL_URL = lambda pk: f'/api/notes/{pk}/'
TAG_LIST_URL = reverse('tag-list')
TAG_DETAIL_URL = lambda pk: f'/api/tags/{pk}/'

NOTE_FIELDS = [
    'id',
    'created',
    'owner',
    'side_a',
    'side_b',
    'tags'
]

TAG_FIELDS = [
    'id',
    'created',
    'owner',
    'name'
]


class PrivateNoteListWithTagsTest(TestCase):

    def setUp(self) -> None:
        self.user1 = create_user(
            username='User1',
            password='user-pass-1'
        )
        self.user2 = create_user(
            username='User2',
            password='user-pass-2'
        )

        self.user1_tag1 = create_tag(owner=self.user1, name='user1-tag1')
        self.user2_tag1 = create_tag(owner=self.user2, name='user2-tag1')
        self.user2_tag2 = create_tag(owner=self.user2, name='user2-tag2')

        self.user1_note1 = create_note(
            owner=self.user1, 
            side_a='user1-note1-a', 
            side_b='user1-note1-b'
        )
        self.user1_note1.tags.add(self.user1_tag1)
        self.user2_note1 = create_note(
            owner=self.user2, 
            side_a='user2-note1-a', 
            side_b='user2-note1-b'
        )
        self.user2_note1.tags.add(self.user2_tag1)
        self.user2_note2 = create_note(
            owner=self.user2, 
            side_a='user2-note2-a', 
            side_b='user2-note2-b'
        )
        
        self.client = APIClient()
        self.client.force_authenticate(user=self.user2)

    def tearDown(self) -> None:
        return super().tearDown()

    def test_note_list_with_tag_query_string_ok(self):
        """test that user can see only notes tagged with tags specified in query string"""
        tag_id = str(self.user2_tag1.id)
        res = self.client.get(NOTES_LIST_URL, {'tags': tag_id})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # confirm all the expected fields are present
        for field in ['notes', 'page', 'num_pages']:
            self.assertIn(field, res.data)
        for note in res.data['notes']:
            for field in NOTE_FIELDS:
                self.assertIn(field, note)

        # confirm only notes tagged with tag_id are present
        for note in res.data['notes']:
            self.assertTrue(len(note['tags']) >= 1)
            self.assertIn(tag_id, {tag['id'] for tag in note['tags']})

    def test_note_list_with_unauthorized_tag_query_string_fail(self):
        """test that user doesn't see any notes 
        if tag in query string is not authored by user
        """
        tag_id = str(self.user1_tag1.id)
        res = self.client.get(NOTES_LIST_URL, {'tags': tag_id})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # confirm all the expected fields are present
        for field in ['notes', 'page', 'num_pages']:
            self.assertIn(field, res.data)
        
        # confirm that no note matches filtering criteria if tag_id is invalid
        self.assertTrue(len(res.data['notes']) == 0)

    def test_note_list_with_invalid_tag_query_string_ok(self):
        """test that user sees all notes
        if tag in query string is invalid (it's a random string or number)
        """
        tag_id = 'wrong-id'
        res = self.client.get(NOTES_LIST_URL, {'tags': tag_id})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # confirm all the expected fields are present
        for field in ['notes', 'page', 'num_pages']:
            self.assertIn(field, res.data)

        # confirm that user sees all notes
        num_all_notes = self.user2.note_set.all().count()
        self.assertEqual(len(res.data['notes']), num_all_notes)

    def test_note_list_with_tag_list_query_string_ok(self):
        """test that user only sees own notes tagged with valid tags
        if mix of valid and invalid tag ids is passed in query string"""
        tag1_id = 'wrong-id'
        tag2_id = str(self.user2_tag1.id)
        res = self.client.get(NOTES_LIST_URL, {'tags': ','.join([tag1_id, tag2_id])})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # confirm all the expected fields are present
        for field in ['notes', 'page', 'num_pages']:
            self.assertIn(field, res.data)

        # confirm that only user notes tagged with valid tag (tag2_id) are present
        for note in res.data['notes']:
            self.assertTrue(len(note['tags']) >= 1)
            self.assertIn(tag2_id, {tag['id'] for tag in note['tags']})


class PrivateNoteDetailWithTagsTests(TestCase):

    def setUp(self) -> None:
        self.user1 = create_user(
            username='User1',
            password='user-pass-1'
        )
        self.user2 = create_user(
            username='User2',
            password='user-pass-2'
        )

        self.user1_tag1 = create_tag(owner=self.user1, name='user1-tag1')
        self.user2_tag1 = create_tag(owner=self.user2, name='user2-tag1')
        self.user2_tag2 = create_tag(owner=self.user2, name='user2-tag2')

        self.user1_note1 = create_note(
            owner=self.user1, 
            side_a='user1-note1-a', 
            side_b='user1-note1-b'
        )
        self.user1_note1.tags.add(self.user1_tag1)
        self.user2_note1 = create_note(
            owner=self.user2, 
            side_a='user2-note1-a', 
            side_b='user2-note1-b'
        )
        self.user2_note1.tags.add(self.user2_tag1)
        
        self.client = APIClient()
        self.client.force_authenticate(user=self.user2)

    def tearDown(self) -> None:
        return super().tearDown()

    def test_note_view_with_tag_ok(self):
        """test that user can view own notes with tags"""
        note_id = self.user2_note1.id
        res = self.client.get(NOTE_DETAIL_URL(note_id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # confirm that tag is present
        self.assertIn('tags', res.data)
        self.assertIsInstance(res.data['tags'], list)
        self.assertTrue(len(res.data['tags']) == 1)

        # confirm that it's the right tag
        tag = res.data['tags'][0]
        self.assertEqual(tag['id'], str(self.user2_tag1.id))
        self.assertEqual(tag['name'], self.user2_tag1.name)

    def test_note_create_with_tag_ok(self):
        """test that user can create note with a tag"""
        data = {
            'side_a': 'user2-note2-a',
            'side_b': 'user2-note2-b',
            'tags': [str(self.user2_tag2.id)]
        }
        res = self.client.post(NOTES_LIST_URL, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # confirm that tag is present
        self.assertIn('tags', res.data)
        self.assertIsInstance(res.data['tags'], list)
        self.assertTrue(len(res.data['tags']) == 1)

        # confirm that it's the right tag
        tag = res.data['tags'][0]
        self.assertEqual(tag['id'], str(self.user2_tag2.id))
        self.assertEqual(tag['name'], self.user2_tag2.name)

    def test_note_create_with_unauthorized_tag_fail(self):
        """test that if user creates note and tags it with invalid tag
        note creation fails
        """
        data = {
            'side_a': 'user2-note2-a',
            'side_b': 'user2-note2-b',
            'tags': ['wrong-id']
        }
        res = self.client.post(NOTES_LIST_URL, data)
        self.assertEqual(res.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_note_update_by_adding_tag_ok(self):
        """test that user can update own note by adding a tag"""
        note_id = str(self.user2_note1.id)
        data = {
            'side_a': self.user2_note1.side_a,
            'side_b': self.user2_note1.side_b,
            'tags': [str(self.user2_tag1.id), str(self.user2_tag2.id)]
        }
        res = self.client.put(NOTE_DETAIL_URL(note_id), data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # confirm note has two tags now
        self.assertEqual(len(res.data['tags']), 2)
        num_note_tags = Note.objects.get(id=note_id).tags.all().count()
        self.assertEqual(num_note_tags, 2)

        # confirm these are correct tags
        for tag in res.data['tags']:
            self.assertTrue(
                tag['id'] in {str(self.user2_tag1.id), str(self.user2_tag2.id)}
            )

    def test_note_update_by_adding_unauthorized_tag_fail(self):
        """test that if note is updated with unauthorized tag note update fails"""
        note_id = str(self.user2_note1.id)
        data = {
            'side_a': self.user2_note1.side_a,
            'side_b': self.user2_note1.side_b,
            'tags': [str(self.user1_tag1.id)]
        }
        res = self.client.put(NOTE_DETAIL_URL(note_id), data)
        self.assertEqual(res.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

        # confirm db didn't update
        note_tags = Note.objects.get(id=note_id).tags.all()
        for tag in note_tags:
            self.assertIn(tag.id, {self.user2_tag1.id})

    def test_note_update_by_deleting_tag_ok(self):
        """test that user can update own note by deleting tag"""
        note_id = str(self.user2_note1.id)
        data = {
            'side_a': self.user2_note1.side_a,
            'side_b': self.user2_note1.side_b,
            'tags': []
        }
        res = self.client.put(NOTE_DETAIL_URL(note_id), data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # confirm note no longer has any tags
        self.assertEqual(len(res.data['tags']), 0)
        num_note_tags = Note.objects.get(id=note_id).tags.all().count()
        self.assertEqual(num_note_tags, 0)

    def test_delete_note_with_tag(self):
        """test that if note is deleted - associated tags stay in db"""
        note_id = str(self.user2_note1.id)
        tag_id = str(self.user2_tag1.id)
        res = self.client.delete(NOTE_DETAIL_URL(note_id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # confirm that tag still exists in db
        tag_exists = self.user2.tag_set.filter(id=tag_id).exists()
        self.assertTrue(tag_exists)

    def test_delete_notes_tag(self):
        """test that if tag is deleted - associated notes stay in db"""
        note_id = str(self.user2_note1.id)
        tag_id = str(self.user2_tag1.id)
        res = self.client.delete(TAG_DETAIL_URL(tag_id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # confirm that tag still exists in db
        note_exists = self.user2.note_set.filter(id=note_id).exists()
        self.assertTrue(note_exists)
