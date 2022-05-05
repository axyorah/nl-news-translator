from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient


USER_REGISTER_URL = reverse('user-register')
USER_LOGIN_URL = reverse('user-login')
USER_PROFILE_URL = reverse('user')


def create_user(**validated_params):
    validated_params['password'] = make_password(
        validated_params['password']
    )
    return User.objects.create(**validated_params)


class PublicUserTests(TestCase):
    """Test user actions that don't require authentication"""

    def setUp(self) -> None:
        self.client = APIClient()

    def tearDown(self) -> None:
        self.client = None

    def test_register_user_ok(self) -> None:
        """test user registration with valid credentials"""
        params = {
            'username': 'New User',
            'password': 'new-user-pass-123'
        }
        res = self.client.post(USER_REGISTER_URL, params)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        user_exist = User.objects.filter(username=params['username']).exists()
        self.assertTrue(user_exist)

        for field in ['id', 'username', 'isAdmin', 'token']:
            self.assertIn(field, res.data)        
        self.assertNotIn('password', res.data)

    def test_register_user_missing_credentials_fail(self) -> None:
        """test user registration fail if some required credentials are missing"""
        res1 = self.client.post(USER_REGISTER_URL, {'username': 'New User'})
        self.assertEqual(res1.status_code, status.HTTP_400_BAD_REQUEST)

        res2 = self.client.post(USER_REGISTER_URL, {'password': 'new-user-pass-123'})
        self.assertEqual(res2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_existing_user_fail(self) -> None:
        """test user registration fail if user already exists"""
        params = {
            'username': 'New User',
            'password': 'new-user-pass-123'
        }
        create_user(**params)

        res = self.client.post(USER_REGISTER_URL, params)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


class PrivateUserTests(TestCase):
    """Test user actions that require authentication"""

    def setUp(self) -> None:
        self.params = {
            'username': 'New User',
            'password': 'new-user-pass-123'
        }
        self.user = create_user(**self.params)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def tearDown(self) -> None:
        self.client = None
        self.user = None

    def test_user_login_ok(self):
        """test successful user login with valid credentials"""
        user_exist = User.objects.filter(username=self.params['username']).exists()
        self.assertTrue(user_exist)

        res = self.client.post(USER_LOGIN_URL, self.params)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        for field in ['access', 'refresh']:
            self.assertIn(field, res.data)

    def test_user_login_invalid_creadentials_fail(self):
        """test failed login in case of invalid creadentials"""
        res = self.client.post(
            USER_LOGIN_URL, {**self.params, 'password': 'wrong-pass'}
        )

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        for field in ['accedd', 'refresh']:
            self.assertNotIn(field, res.data)
