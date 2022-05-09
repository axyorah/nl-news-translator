import json
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


class NewsSelectedTests(TestCase):

    def setUp(self) -> None:
        self.client = APIClient()

    def tearDown(self) -> None:
        self.client = None

    def test_nos_paragraphs_ok(self):
        source = 'nos.nl'
        url = 'https://nos.nl/index.php/l/2417100'
        res = self.client.get(NEWS_ARTICLE_URL, {
            'source': source, 'url': url
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        self.assertIn('paragraphs', res.data)
        self.assertIsInstance(res.data['paragraphs'], list)
        self.assertEqual(
            res.data['paragraphs'][0],
            "In Brussel heeft een man vlak na het verlaten van de gevangenis een dakloze man in brand gestoken bij het Zuidstation. Dat is gebeurd in de nacht van vrijdag op zaterdag en is vastgelegd door bewakingscamera's op het station, melden Belgische media waaronder Sudinfo."
        )

    def test_missing_query_params_fail(self):
        url = 'https://nos.nl/index.php/l/2417100'
        res = self.client.get(NEWS_ARTICLE_URL, {'url': url})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertIn('errors', res.data)
        self.assertIn(
            'Please specify both `url` and `source` in a query string',
            res.data['errors']
        )

    def test_invalid_query_params_fail(self):
        source = 'nos'
        url = 'https://nos.nl/index.php/l/2417100'
        res = self.client.get(NEWS_ARTICLE_URL, {
            'source': source, 'url': url
        })
        self.assertEqual(res.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

        self.assertIn('errors', res.data)
        self.assertIn(
            'Posts from `nos` cannot be parsed yet.',
            res.data['errors']
        )


class NewsTranslatedTests(TestCase):

    def setUp(self) -> None:
        self.client = APIClient()

    def tearDown(self) -> None:
        self.client = None

    def test_translations_list_ok(self):
        nl = 'Vertaal dit'
        en = 'Translate this'

        # sentences list bugs out unless it's done with json.dumps(.)
        res = self.client.post(NEWS_TRANSLATED_URL, 
            content_type='application/json',
            data=json.dumps({'sentences': [nl]})
        )        
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        self.assertIn('translations', res.data)
        self.assertEqual(res.data['translations'], [en])

    def test_translations_list_fail(self):
        res = self.client.post(NEWS_TRANSLATED_URL, 
            content_type='application/json',
            data=json.dumps({'sentences': 'Dit is geen lijst'})
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertIn('errors', res.data)
        self.assertIn(
            'Sentences must be a list of strings',
            res.data['errors']
        )