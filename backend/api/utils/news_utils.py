from typing import List, Tuple, Set, Dict, Union, Optional

import requests as rq
from datetime import datetime
import time
import json
   

class NewsRequester:
    CATEGORIES = {
        'business', 
        'entertainment', 
        'general', 
        'health', 
        'science', 
        'sports', 
        'technology'
    }
    def __init__(self, api_key):
        self.api_key = api_key
        self.url = 'https://newsapi.org/v2/top-headlines?'
        self.period = 14 # default period [days] over which news would be requested        

    def _validate(
        self,
        q: str, 
        category_list: List[str], 
        from_date: datetime.date, 
        to_date: datetime.date
    ) -> None:
        if q and not isinstance(q, str):
            raise TypeError(
                f'`q` should be a string'
            )

        if category_list and not isinstance(category_list, list):
            raise TypeError(
                f'Categories should be given as a list of string, '
                f'got {category_list}'
            )
        
        if category_list and any(
            cat not in self.CATEGORIES for cat in category_list
        ):
            raise ValueError(
                f'Categories should be one or several of {self.CATEGORIES}; '
                f'got {category_list}'
            )
        
        if from_date and not isinstance(from_date, datetime):
            raise TypeError(
                f'`from_date` should be of type `datetime.datetime`'
            )

        if to_date and not isinstance(to_date, datetime):
            raise TypeError(
                f'`to_date` should be of type `datetime.datetime`'
            )
            
        if from_date and to_date and from_date > to_date:
            raise ValueError(
                f'`from_date` should come before `to_date`, got '
                f'`from_date`: {from_date} and `to_date`: {to_date}'
            )

        if from_date and from_date > datetime.now():
            raise ValueError(
                f'`from_date` is out of range, got {from_date}'
            )

    def _retry(self, url, times=3, sleep=5):        

        for _ in range(times):
            res = rq.get(url)

            if res.status_code == 200:
                return res.json()

            time.sleep(sleep)

        return {"res": res.text}

    def _get_valid(self, params):
        url = (
            f'{self.url}'
            f'{"category=" + params["category"] + "&" if params["category"] else ""}'
            f'{"q=" + params["q"] + "&" if params["q"] else ""}'
            f'{"from=" + params["from"] + "&" if params["from"] else ""}'
            f'{"to=" + params["to"] + "&" if params["to"] else ""}'
            f'country=nl&'
            f'apiKey={self.api_key}'
        )

        return self._retry(url, times=3, sleep=5)

    def get(
        self,
        q: str = None, 
        category_list: Optional[List[str]] = None,
        from_date: Optional[datetime.date] = None, 
        to_date: Optional[datetime.date] = None
    ):  
        """
        # TODO: make it one category at a time after all...
        fetches news from newsapi filtered by:
        q: [optional str] key word 
        category_list: [optional list[str]]: list of categories 
            from NewsRequester.CATEGORIES;
            if empty or None all categories will be used
        from_date: [optional datetime obj]
        to_date: [optional datetimeobj]
        """
        # # <<< TEMP ...
        # with open('news.json', 'r') as f:
        #     temp = json.load(f)
        # for article in temp['articles']:
        #     article['category'] = 'general'
        # return temp
        # # ... TEMP >>>

        try:
            self._validate(q, category_list, from_date, to_date)
        except Exception as e:
            print(e)
            raise e

        # use default values for params if no value is provided
        to_date = to_date or datetime.now()
        from_date = from_date or datetime.fromtimestamp(
            datetime.timestamp(to_date) - self.period * 24 * 60 * 60
        )
        category_list = category_list if category_list else list(self.CATEGORIES)

        # newsapi can only process one category (or none = all) at a time;
        # additonally, if `q` is set `category` also needs to be provided;
        # so we'll need to send several small requests for each category 
        # and lump them together at the end
        final = {
            'status': None,
            'totalResults': 0,
            'articles': []
        }

        for category in category_list:
            params = {
                'q': q,
                'category': category,
                'from': str(from_date).split(' ')[0],
                'to': str(to_date).split(' ')[0]
            }
            res = self._get_valid(params)

            if res.get('status') and res['status'] == 'ok':
                final['status'] = 'ok'
                final['totalResults'] += res.get('totalResults', 0)
                final['articles'] += [
                    {**article, **{'category': category}} 
                    for article in res.get('articles', [])
                ]
            else:
                print(f'Maybe error: {res}')
                raise Exception(res['res'])

        return final
