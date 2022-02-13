from pyclbr import Function
from typing import List, Tuple, Set, Dict, Union, Optional
from types import FunctionType

import requests as rq
from bs4 import BeautifulSoup
import json

from abc import ABC

class Scrapper(ABC):
    def __init__(self):
        self.name = ''
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36',
            'Platform': 'Linux x86_64',
            'Cookies-Enabled': 'yes',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
        
    def accept_cookies(self, html: str) -> str:
        pass
    
    def get_paragraphs(self, html: str) -> str:
        pass
    
    def get_article(self, url: str) -> List[List[str]]:
        pass


class NOSScrapper(Scrapper):
    def __init__(self):
        super().__init__()
        self.name = 'Nos.nl'
        
    def accept_cookies(self, html):
        # for nos cookies are not blocking
        return html
    
    def get_paragraphs(self, html):
        
        soup = BeautifulSoup(html, features="html.parser")
        
        p_nodes = soup.findAll('p')
        p_nodes = [
            p for p in p_nodes
            if 'text' in p.get('class')[0] or
            'text' in p.get('class')
        ]
        
        ps = [
            p.get_text()
            for p in p_nodes
        ]
        
        return ps
    
    def get_article(self, url):
        res = rq.get(url)
        
        if res.status_code != 200:
            print(res.text)
            return 
        
        html = res.text
        html = self.accept_cookies(html)
        ps = self.get_paragraphs(html)
        
        return ps



source2paragraphs = {
    'Nos.nl': NOSScrapper().get_article
}

