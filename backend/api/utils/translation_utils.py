from typing import List, Tuple, Set, Dict, Union, Optional
from types import FunctionType

from transformers import MarianMTModel, MarianTokenizer

from abc import ABC

def singleton(cls):
    instances = {}
    def instantiate(*args, **kwargs):
        if not instances:
            instances['cls'] = cls(*args, **kwargs)
        return instances['cls']
            
    return instantiate

@singleton
class NlToEnTranslator:
    def __init__(self):
        print('loading Helsinki-NLP/opus-mt-nl-en')
        self.model_name = "Helsinki-NLP/opus-mt-nl-en"
        self.model = MarianMTModel.from_pretrained(self.model_name)
        self.tokenizer = MarianTokenizer.from_pretrained(self.model_name)
        
    def translate(self, src_text: List[str]) -> List[str]:
        tokens = self.model.generate(**self.tokenizer(
            src_text, 
            return_tensors="pt", 
            padding=True
        ))
        
        return [
            self.tokenizer.decode(token, skip_special_tokens=True) 
            for token in tokens
        ]