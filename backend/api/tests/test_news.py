from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient


NEWS_LIST_URL = reverse('news')
NEWS_ARTICLE_URL = reverse('news-selected')
NEWS_TRANSLATED_URL = reverse('news-translations')

NEWS_CATEGORIES = [
    'business', 
    'entertainment', 
    'general', 
    'health', 
    'science', 
    'sports', 
    'technology'
]

NEWS_RESPONSE_FIELDS = [
    'status',
    'totalResults',
    'articles'
]

ARTICLE_FIELDS = [
    'source',
    'author',
    'title',
    'description',
    'url',
    'urlToImage',
    'publishedAt',
    'content'
]


class NewsListTests(TestCase):
    """test fetching list of news with newsapi;
    `news` endpoint is public;
    TODO: add date filter to news_utils and resp tests
    """

    def setUp(self) -> None:
        self.client = APIClient()

    def tearDown(self) -> None:
        self.client = None

    def test_news_list_no_param_ok(self):
        res = self.client.get(NEWS_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        for field in NEWS_RESPONSE_FIELDS:
            self.assertIn(field, res.data)

        if res.data['articles']:
            for field in ARTICLE_FIELDS:
                self.assertIn(field, res.data['articles'][0])

    def test_news_list_q_ok(self):
        q = 'crypto'
        res = self.client.get(NEWS_LIST_URL, {'q': q})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        for field in NEWS_RESPONSE_FIELDS:
            self.assertIn(field, res.data)

    def test_news_list_category_list_one_ok(self):
        category_list = 'general'
        res = self.client.get(NEWS_LIST_URL, {'category_list': category_list})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        for field in NEWS_RESPONSE_FIELDS:
            self.assertIn(field, res.data)

    def test_news_list_category_list_one_fail(self):
        category_list = 'wrong-category'
        res = self.client.get(NEWS_LIST_URL, {'category_list': category_list})
        self.assertEqual(res.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

        self.assertIn('errors', res.data)
        self.assertIn(
            'Categories should be one or several of',
            res.data['errors']
        )

    def test_news_list_category_list_mult1_ok(self):
        category_list = 'general,technology'
        res = self.client.get(NEWS_LIST_URL, {'category_list': category_list})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        for field in NEWS_RESPONSE_FIELDS:
            self.assertIn(field, res.data)

    def test_news_list_category_list_mult2_ok(self):
        category_list = 'general, technology'
        res = self.client.get(NEWS_LIST_URL, {'category_list': category_list})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        for field in NEWS_RESPONSE_FIELDS:
            self.assertIn(field, res.data)

    def test_news_list_category_list_mult1_fail(self):
        category_list = 'general,wrong-category'
        res = self.client.get(NEWS_LIST_URL, {'category_list': category_list})
        self.assertEqual(res.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

        self.assertIn('errors', res.data)
        self.assertIn(
            'Categories should be one or several of',
            res.data['errors']
        )

    def test_news_list_category_list_mult2_fail(self):
        category_list = 'general technology'
        res = self.client.get(NEWS_LIST_URL, {'category_list': category_list})
        self.assertEqual(res.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

        self.assertIn('errors', res.data)
        self.assertIn(
            'Categories should be one or several of',
            res.data['errors']
        )
