from typing import List, Tuple, Set, Dict, Union, Optional
import logging
from abc import ABC

import requests as rq
from datetime import datetime
import time


logger = logging.getLogger(__name__)

   
class TokenRequester(ABC):
    def __init__(self, url: str, token: str):
        self.url = url
        self.token = token

    def _validate(self, **params: Dict) -> None:
        pass

    def _retry(self, url: str, times: int = 3, sleep: int = 5) -> Dict:
        for _ in range(times):
            res = rq.get(url, headers={
                'Authorization': f'Bearer {self.token}'
            })

            if res.status_code == 200:
                return res.json()

            time.sleep(sleep)

        return {"raw_response": res}

    def get(self, **params: Dict) -> Dict:
        pass

class NewsRequester(TokenRequester):
    CATEGORIES = {
        'business', 
        'entertainment', 
        'general', 
        'health', 
        'science', 
        'sports', 
        'technology'
    }
    def __init__(self, api_key: str):
        super().__init__('https://newsapi.org/v2/top-headlines?', api_key)
        self.period = 14 # default period [days] over which news would be requested

    def _validate(
            self, 
            q: str = '', 
            category_list: List[str] = [], 
            to_ts: Optional[int] = None, 
            from_ts: Optional[int] = None
        ) -> None:
        logger.debug('Validating query params for fetching news from newsapi...')
        
        # validate q: should be any string
        if q and not isinstance(q, str):
            raise TypeError(
                f'`q` should be a string'
            )
        
        # validate category_list:
        # should be a list of unique categories from preset
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
        
        # validate to_ts: 
        # should be None or int corresponds to any timestamp [sec]
        if to_ts and not (
            isinstance(to_ts, int) or isinstance(to_ts, float)
        ):
            raise TypeError(
                f'`to_ts` should be an int/float '
                f'corresponding to a timestamp in seconds; '
                f'got {to_ts}'
            )
                
        if to_ts and to_ts > datetime.now().timestamp():
            raise ValueError(
                f'`to_ts` should be less than today\'s timestamp in seconds; '
                f'got `to_ts`: {to_ts} and today: {int(datetime.now().timestamp())}'                    
            )
        
        # validate from_ts: 
        # should be None or int corresponding to a timestamp [sec]
        # should precede to_ts
        if from_ts and not (
            isinstance(from_ts, int) or isinstance(from_ts, float)
        ):
            raise TypeError(
                f'`from_ts` should be an int/float '
                f'corresponding to a timestamp in seconds; '
                f'got {from_ts}'
            )
                
        if to_ts and from_ts and to_ts <= from_ts:
            raise ValueError(
                f'`from_ts` should precede `to_ts`; '
                f'got `from_ts`: {from_ts} and `to_ts`: {to_ts}'
            )
        
        if to_ts is None and from_ts and datetime.now().timestamp() <= from_ts:
            raise ValueError(
                f'`from_ts` should precede `to_ts`; '
                f'got `from_ts`: {from_ts} and `to_ts`: {to_ts}'
            )
    
    def _adjust_params(self, **params: Dict) -> Dict:
        logger.debug('Adjusting query params for fetching news from newsapi...')

        params = params.copy()
                
        if not params.get('to_ts'):
            params['to_ts'] = int(datetime.now().timestamp())
        params['to'] = datetime\
            .fromtimestamp(params['to_ts'])\
            .isoformat()\
            .split('T')[0]
                
        if not params.get('from_ts'):
            params['from_ts'] = datetime\
                .fromtimestamp(
                    params['to_ts'] - self.period * 24 * 60 * 60                
                )\
                .timestamp()
        params['from'] = datetime\
            .fromtimestamp(params['from_ts'])\
            .isoformat()\
            .split('T')[0]
                
        return params

    def _params_to_url(self, **params) -> str:
        """convert valid params to url with query string 
        recognizable by news api;
        expects `params` to have the following optional fields:
        - category: [str] one of seven categories recognized by newsapi
        - q: [str] search keyword
        - from: [str] YYYY-MM-DD
        - to: [str] YYYY-MM-DD
        """
        logger.debug('Converting query params to valid url for newsapi...')

        return (
            f'{self.url}'
            f'{"category=" + params["category"] + "&" if params.get("category") else ""}'
            f'{"q=" + params["q"] + "&" if params.get("q") else ""}'
            f'{"from=" + params["from"] + "&" if params.get("from") else ""}'
            f'{"to=" + params["to"] + "&" if params.get("to") else ""}'
            f'country=nl'
        )
        
    def get(self, 
            q: str = '', 
            category_list: List[str] = [], 
            from_ts: Optional[int] = None, 
            to_ts: Optional[int] = None
        ) -> Dict:
        logger.debug('Querying newsapi...')
                
        def add_respose_for_category(category: str = '') -> None:
            url = self._params_to_url(**params, category=category)
            r = self._retry(url, times=3, sleep=5)
                
            if r.get('status') and r['status'] == 'ok':
                res['status'] = r.get('status')
                res['totalResults'] += r.get('totalResults', 0)
                res['articles'] += [
                    {**article, 'category': category}
                    for article in r.get('articles', [])
                ]
            else:
                msg = ''
                try:
                    msg = r['raw_response'].json()['message']
                except:
                    msg = r['raw_response'].text
                finally:
                    logger.error(msg)
                    raise Exception(msg)
                    
                
        try:        
            params = {
                'q': q,
                'category_list': category_list,
                'from_ts': from_ts,
                'to_ts': to_ts
            }
                    
            self._validate(**params)
                    
            params = self._adjust_params(**params)
                
            res = {
                'status': 'ok',
                'totalResults': 0,
                'articles': []
            }
                
            if not params['category_list']:
                params['category_list'] = ['general']
            
            for category in params['category_list']:
                add_respose_for_category(category)
                
            return res
        
        except Exception as e:
            logger.error(e)
            raise e
        
