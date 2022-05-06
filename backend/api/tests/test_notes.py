from wsgiref import validate
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from rest_framework import status
from rest_framework.test import APIClient

from ..models import Note, Tag

NOTES_LIST_URL = reverse('note-list')
#NOTE_URL = reverse('note-detail')

NOTE_FIELDS = [
    'id',
    'created',
    'owner',
    'side_a',
    'side_b',
    'tags'
]

def create_user(**validated_params):
    validated_params['password'] = make_password(
        validated_params['password']
    )
    return User.objects.create(**validated_params)

def create_note(**validated_params):
    return Note.objects.create(**validated_params)

class PublicNoteTests(TestCase):
    """Test note actions that don't require authorization"""

    def setUp(self) -> None:
        self.client = APIClient()
        self.user = create_user(
            username='New Name',
            password='new-pass-123'
        )
        self.notes = [
            create_note(
                owner=self.user, side_a='test-note-a', side_b='test-note-b'
            )
        ]

    def tearDown(self) -> None:
        self.client = None
        self.user = None
        self.notes = None

    def test_list_notes_nologin_fail(self):
        """test that anonymous user can't see any notes"""
        res = self.client.get(NOTES_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('detail', res.data)
        self.assertIn('\'AnonymousUser\' object has no attribute \'note_set\'', res.data['detail'])


class PrivateNoteListTests(TestCase):

    def setUp(self) -> None:
        self.user1 = create_user(
            username='User1',
            password='user-pass-1'
        )
        self.user2 = create_user(
            username='User2',
            password='user-pass-2'
        )
        self.notes = [
            create_note(
                owner=self.user1, side_a='user1-note1-a', side_b='user1-note1-b'
            ),
            create_note(
                owner=self.user1, side_a='user1-note2-a', side_b='user1-note2-b'
            ),
            create_note(
                owner=self.user2, side_a='user2-note1-a', side_b='user2-note1-b'
            )
        ]

        self.client = APIClient()
        self.client.force_authenticate(self.user2)

    def test_list_notes__response_ok(self):
        """test that authorized user can see his own notes"""
        res = self.client.get(NOTES_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # res contains all expected fields: note, page, num_pages
        self.assertIn('notes', res.data)
        self.assertIn('page', res.data)
        self.assertIn('num_pages', res.data)

        # default page should be `1`
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

