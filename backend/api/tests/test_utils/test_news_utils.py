from typing import Type
from datetime import datetime
from django.test import TestCase

from api.utils.news_utils import NewsRequester

CATEGORIES = {
    'business', 
    'entertainment', 
    'general', 
    'health', 
    'science', 
    'sports', 
    'technology'
}


class NewsRequesterTests(TestCase):

    def setUp(self) -> None:
        self.api_key = 'mock-api-key'
        self.requester = NewsRequester(self.api_key)

    def tearDown(self) -> None:
        self.requester = None

    def test_initial_conditions(self):
        """test if news requester is correctly instantiated"""
        self.assertEqual(self.requester.url, 'https://newsapi.org/v2/top-headlines?')
        self.assertEqual(self.requester.token, self.api_key)
        self.assertEqual(self.requester.CATEGORIES, CATEGORIES)
        self.assertTrue(hasattr(self.requester, 'period'))

    def test_validate_empty_ok(self):
        self.requester._validate()

    def test_validate_q_ok(self):
        self.requester._validate(q='abc')

    def test_validate_q_fail(self):
        with self.assertRaises(TypeError):
            self.requester._validate(q={'q': 'crypto'})
        with self.assertRaises(TypeError):
            self.requester._validate(q=['a','b','c'])
        with self.assertRaises(TypeError):
            self.requester._validate(q=123)

    def test_validate_category_list_ok(self):
        self.requester._validate(category_list=[])
        self.requester._validate(category_list=['business'])
        self.requester._validate(category_list=[
            'business', 'entertainment'
        ])
        self.requester._validate(category_list=[
            'business', 'entertainment', 'general'
        ])
        self.requester._validate(category_list=[
            'business', 'entertainment', 'general', 'health'
        ])
        self.requester._validate(category_list=[
            'business', 'entertainment', 'general', 'health', 'science'
        ])
        self.requester._validate(category_list=[
            'business', 
            'entertainment', 
            'general', 
            'health', 
            'science', 
            'sports'
        ])
        self.requester._validate(category_list=[
            'business', 
            'entertainment', 
            'general', 
            'health', 
            'science', 
            'sports', 
            'technology'
        ])

    def test_validate_category_list_fail(self):
        with self.assertRaises(TypeError):
            self.requester._validate(category_list='business')
        with self.assertRaises(TypeError):
            self.requester._validate(category_list={'business'})
        with self.assertRaises(ValueError):
            self.requester._validate(category_list=['wrong-category'])

    def test_validate_to_ts_ok(self):
        self.requester._validate(to_ts=123)
        self.requester._validate(to_ts=123.456)

    def test_validate_to_ts_fail(self):
        with self.assertRaises(TypeError):
            self.requester._validate(to_ts='123')

    def test_validate_from_ts_ok(self):        
        self.requester._validate(from_ts=123)
        self.requester._validate(from_ts=123.456)

    def test_validate_from_ts_fail(self):
        with self.assertRaises(TypeError):
            self.requester._validate(from_ts='123')
        with self.assertRaises(ValueError):
            self.requester._validate(to_ts=123, from_ts=456)
        with self.assertRaises(ValueError):
            now = datetime.now()
            self.requester._validate(from_ts=now.timestamp() + 1e5)

    def test_adjust_params_ok(self):
        now = datetime.now()
        to_date = now.isoformat().split('T')[0]
        from_date = datetime.fromtimestamp(
            now.timestamp() - self.requester.period * 24 * 3600
        ).isoformat().split('T')[0]

        params = self.requester._adjust_params()
        self.assertIn('to',  params)
        self.assertEqual(to_date, params['to'])
        self.assertIn('from', params)
        self.assertEqual(from_date, params['from'])

    def test_params_to_url_ok(self):
        url_base = 'https://newsapi.org/v2/top-headlines?'
        
        url = self.requester._params_to_url(q='query')
        self.assertEqual(url, (
            f'{url_base}'
            f'q=query&'
            f'country=nl'
        ))

        url = self.requester._params_to_url(q='query', category='general')
        self.assertEqual(url, (
            f'{url_base}'
            f'category=general&'
            f'q=query&'
            f'country=nl'
        ))

        url = self.requester._params_to_url(**{
            'q':'query', 'category':'general', 'from': '2022-03-03'
        })
        self.assertEqual(url, (
            f'{url_base}'
            f'category=general&'
            f'q=query&'
            f'from=2022-03-03&'
            f'country=nl'
        ))

        url = self.requester._params_to_url(**{
            'q':'query', 'category':'general', 'from': '2022-03-03', 'to': '2022-03-05'
        })
        self.assertEqual(url, (
            f'{url_base}'
            f'category=general&'
            f'q=query&'
            f'from=2022-03-03&'
            f'to=2022-03-05&'
            f'country=nl'
        ))
