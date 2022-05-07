from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from ..models import Tag
from .utils import create_user, create_tag


TAG_LIST_URL = reverse('tag-list')
TAG_DETAIL_URL = lambda pk: f'/api/tags/{pk}/'

TAG_FIELDS = [
    'id',
    'created',
    'owner',
    'name'
]


class PublicTagListTests(TestCase):

    def setUp(self) -> None:
        self.client = APIClient()
        self.user = create_user(username='Test User', password='test-123')
        self.tags = [
            create_tag(owner=self.user, name='test-tag')
        ]

    def tearDown(self) -> None:
        self.client = None
        self.user = None
        self.tags = None

    def test_tag_list_nologin_fail(self):
        """test that anonymous user cannot see any tags"""
        res = self.client.get(TAG_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        for field in TAG_FIELDS + ['tags']:
            self.assertNotIn(field, res.data)


class PrivateTagListTests(TestCase):

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

        self.client = APIClient()
        self.client.force_authenticate(self.user2)

    def tearDown(self) -> None:
        self.client = None
        self.user1 = None
        self.user2 = None
        self.user1_tag1 = None
        self.user2_tag1 = None

    def test_tag_list_response_ok(self):
        """test if logged in user can see his tags"""
        res = self.client.get(TAG_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('tags', res.data)
        self.assertIsInstance(res.data['tags'], list)

    def test_tag_list_fields_ok(self):
        """test if user tags have all expected fields with expected content"""
        res = self.client.get(TAG_LIST_URL)

        # check if expected fields are present
        self.assertEqual(len(res.data['tags']), 1)
        for field in TAG_FIELDS:
            self.assertIn(field, res.data['tags'][0])

        # check if content is correct
        tag = res.data['tags'][0]
        self.assertEqual(tag['owner'], self.user2_tag1.owner.id)
        self.assertEqual(tag['name'], self.user2_tag1.name)


class PublicTagDetailTests(TestCase):

    def setUp(self):
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

        self.client = APIClient()

    def tearDown(self) -> None:
        self.client = None
        self.user1 = None
        self.user2 = None
        self.user1_tag1 = None
        self.user2_tag2 = None

    def test_tag_detail_nologin_fail(self):
        """test that anonymous user can't see specific tag"""
        tag_id = self.user1_tag1.id
        res = self.client.get(TAG_DETAIL_URL(tag_id))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_tag_detail_create_nologin_fail(self):
        """test that anonymous user can't create a tag"""
        num_tags_before = Tag.objects.all().count()

        res = self.client.post(TAG_LIST_URL, {'name': 'anonymous-tag'})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        num_tags_after = Tag.objects.all().count()
        self.assertEqual(num_tags_before, num_tags_after)

    def test_tag_detail_udpate_nologin_fail(self):
        """test that anonymous user can't update specific tag"""
        tag_id = self.user1_tag1.id
        tag_name_before = self.user1_tag1.name

        res = self.client.put(TAG_DETAIL_URL(tag_id), {'name': 'anonymous-tag'})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        tag_name_after = Tag.objects.get(id=tag_id).name
        self.assertEqual(tag_name_before, tag_name_after)

    def test_tag_detail_delete_nologin_fail(self):
        """test that anonymous user can't delete specific tag"""
        tag_id = self.user1_tag1
        num_tags_before = Tag.objects.all().count()

        res = self.client.delete(TAG_DETAIL_URL(tag_id))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        num_tags_after = Tag.objects.all().count()
        self.assertEqual(num_tags_before, num_tags_after)


class PrivateTagDetailTests(TestCase):

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

        self.client = APIClient()
        self.client.force_authenticate(user=self.user2)

    def tearDown(self) -> None:
        self.client = None
        self.user1 = None
        self.user2 = None
        self.user1_tag1 = None
        self.user2_tag1 = None

    def test_tag_detail_view_ok(self):
        """test that logged in user can see own tag"""
        tag_id = self.user2_tag1.id
        res = self.client.get(TAG_DETAIL_URL(tag_id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # confirm all the expected fields are present
        for field in TAG_FIELDS:
            self.assertIn(field, res.data)

        # confirm content is correct
        self.assertEqual(res.data['owner'], self.user2_tag1.owner.id)
        self.assertEqual(res.data['name'], self.user2_tag1.name)

    def test_tag_detail_view_unauthorized_fail(self):
        """test that user can't view other users tag"""
        tag_id = self.user1_tag1.id
        res = self.client.get(TAG_DETAIL_URL(tag_id))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

        # confirm that tag fields are not attached to error message
        for field in TAG_FIELDS:
            self.assertNotIn(field, res.data)

    def test_tag_detail_create_ok(self):
        """test that user can create tag"""
        data = {'name': 'new-user2-tag'}
        res = self.client.post(TAG_LIST_URL, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # confirm that all expected fields are present
        for field in TAG_FIELDS:
            self.assertIn(field, res.data)

        # confirm tag is in db
        tag_exists = Tag.objects.filter(id=res.data['id']).exists()
        self.assertTrue(tag_exists)

        # confirm that content is as expected
        tag = Tag.objects.get(id=res.data['id'])
        self.assertEqual(res.data['owner'], self.user2.id)
        self.assertEqual(res.data['name'], data['name'])
        self.assertEqual(tag.owner.id, self.user2.id)
        self.assertEqual(tag.name, data['name'])

    def test_tag_detail_update_ok(self):
        """test that user can update own tag"""
        tag_id = self.user2_tag1.id
        data = {'name': 'updated-user2-tag'}
        res = self.client.put(TAG_DETAIL_URL(tag_id), data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # confirm all expected fields are present
        for field in TAG_FIELDS:
            self.assertIn(field, res.data)

        # confirm tag is in db
        tag_exists = Tag.objects.filter(id=tag_id).exists()
        self.assertTrue(tag_exists)

        # confirm tag content is updated
        tag = Tag.objects.get(id=tag_id)
        self.assertEqual(res.data['owner'], self.user2.id)
        self.assertEqual(res.data['name'], data['name'])
        self.assertEqual(tag.owner.id, self.user2.id)
        self.assertEqual(tag.name, data['name'])

    def test_tag_detail_update_unauthorized_fail(self):
        """test that user cannot update someone else's tag"""
        tag_id = self.user1_tag1.id
        data = {'name': 'updated-user2-tag'}
        tag_name_before = self.user1_tag1.name
        res = self.client.put(TAG_DETAIL_URL(tag_id), data)
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

        # confirm that tag info is not included in error msg
        for field in TAG_FIELDS:
            self.assertNotIn(field, res.data)

        # confirm that db is not updated
        tag_exists = Tag.objects.filter(id=tag_id).exists()
        self.assertTrue(tag_exists)
        tag_name_after = Tag.objects.get(id=tag_id).name
        self.assertEqual(tag_name_before, tag_name_after)

    def test_tag_detail_delete_ok(self):
        """test that user can delete own tag"""
        tag_id = self.user2_tag1.id
        res = self.client.delete(TAG_DETAIL_URL(tag_id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # confirm that tag is no longer in db
        tag_exists = Tag.objects.filter(id=tag_id).exists()
        self.assertFalse(tag_exists)

    def test_tag_detail_unauthorized_fail(self):
        """test that user can't delete someone else's tag"""
        tag_id = self.user1_tag1.id
        tag_name_before = self.user1_tag1.name
        res = self.client.delete(TAG_DETAIL_URL(tag_id))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

        # confirm that tag info is not attached to error msg
        for field in TAG_FIELDS:
            self.assertNotIn(field, res.data)

        # confirm that tag is still in db
        tag_exists = Tag.objects.filter(id=tag_id)
        self.assertTemplateNotUsed(tag_exists)

        # confirm that tag content is intact
        tag_name_after = Tag.objects.get(id=tag_id).name
        self.assertEqual(tag_name_before, tag_name_after)
