from typing import List, Tuple, Set, Dict, Union, Optional

import requests as rq
import datetime
import time

def newsform2params(form):

    params = {
        'q': None,
        'category_list': [],
        'from_date': None,
        'to_date': None
    }

    for k,v in form.items():
        if k == 'query_filter':
            params['q'] = v[0]
        elif 'category' in k:
            # TODO: replace by regex
            params['category_list'].append(k.split('-')[-1])
        elif k == 'from-filter':
            pass
        elif k == 'to-filter':
            pass

    return params
    

class NewsRequester:
    def __init__(self, api_key):
        self.api_key = api_key
        self.url = 'https://newsapi.org/v2/top-headlines?'
        self.period = 3 # default period [days] over which news would be requested
        self.categories = {
            'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'
        }

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
            cat not in self.categories for cat in category_list
        ):
            raise ValueError(
                f'Categories should be one or several of {self.categories}; '
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

    def _retry(self, params, times=3, sleep=5):
        for _ in range(times):
            res = rq.get(
                f'{self.url}'
                f'{"category=" + params["category"] + "&" if params["category"] else ""}'
                f'{"from=" + params["from"] + "&" if params["from"] else ""}'
                f'{"to=" + params["to"] + "&" if params["to"] else ""}'
                f'country=nl&'
                f'sortBy=popularity&'
                f'apiKey={self.api_key}'
            )

            if res.status_code == 200:
                return res.json()

            time.sleep(sleep)

        return res.text

    def get(
        self,
        q: str = None, 
        category_list: Optional[List[str]] = None,
        from_date: Optional[datetime.date] = None, 
        to_date: Optional[datetime.date] = None
    ):
        try:
            self._validate(q, category_list, from_date, to_date)
        except Exception as e:
            print(e)
            return

        to_date = to_date or datetime.now()
        from_date = from_date or datetime.fromtimestamp(
            to_date - self.period * 24 * 60 * 60
        )

        params = {
            'q': q,
            'category': ','.join(category_list),
            'from': str(from_date).split(' ')[0],
            'to': str(to_date).split(' ')[0]
        }

        return self._retry(params, times=3, sleep=5)

        