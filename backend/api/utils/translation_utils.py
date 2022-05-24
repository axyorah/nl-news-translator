from typing import List, Tuple, Set, Dict, Union, Optional

import os
import logging
from abc import ABC

from transformers import MarianMTModel, MarianTokenizer


logger = logging.getLogger(__name__)


def singleton(cls):
    instances = {}
    def instantiate(*args, **kwargs):
        if not instances:
            instances['cls'] = cls(*args, **kwargs)
        return instances['cls']
            
    return instantiate


class Translator(ABC):
    def __init__(self, model_name):
        self.model_name = model_name
        self.model = None
        self.tokenizer = None

    def load_model_and_tokenizer(self) -> None:
        """Loads model and tokenizer required for translation"""
        pass

    def translate(self, src_text: List[str]) -> List[str]:
        """Translates a list of sentences (each string is a sentence)"""
        pass


@singleton
class NlToEnTranslator(Translator):
    MODEL_FILES = (
        "config.json",
        "pytorch_model.bin"
    )
    
    TOKENIZER_FILES = (
        "source.spm",
        "special_tokens_map.json",
        "target.spm",
        "vocab.json",
        "tokenizer_config.json"
    )

    def __init__(self, model_name="Helsinki-NLP/opus-mt-nl-en"):
        super().__init__(model_name)

        cwd = os.path.join("backend", "api", "utils")
        self.model_local_path = os.path.join(cwd, "saves", "model")
        self.tokenizer_local_path = os.path.join(cwd, "saves", "tokenizer")

        self.load_model_and_tokenizer()

    def load_model_and_tokenizer(self) -> None:

        def conditionally_load(
                condition: bool, 
                loader: Union[MarianMTModel, MarianTokenizer], 
                path_if_true: str, 
                path_if_false: str, 
                comment_if_true: str = "Loading item",
                comment_if_false: str = "Loading item"
            ) -> Union[MarianMTModel, MarianTokenizer]:
            
            if condition:
                logger.info(comment_if_true)
                loaded = loader.from_pretrained(path_if_true)
            else:
                logger.info(comment_if_false)
                loaded = loader.from_pretrained(path_if_false)
                loaded.save_pretrained(path_if_true)

            return loaded

        
        os.makedirs(self.model_local_path, exist_ok=True)
        os.makedirs(self.tokenizer_local_path, exist_ok=True)

        model_files_exist = all(
            os.path.exists( os.path.join(self.model_local_path, fname) ) 
            for fname in self.MODEL_FILES
        )
        tokenizer_files_exits = all(
            os.path.exists( os.path.join(self.tokenizer_local_path, fname) )
            for fname in self.TOKENIZER_FILES
        )

        self.model = conditionally_load(
            model_files_exist, 
            MarianMTModel, 
            self.model_local_path, 
            self.model_name,
            f"Loading {self.model_name} from local storage",
            f"Loading {self.model_name} from huggingface"
        )
        self.tokenizer = conditionally_load(
            tokenizer_files_exits, 
            MarianTokenizer, 
            self.tokenizer_local_path, 
            self.model_name,
            "Loading tokenizer from local storage",
            "Loading tokenizer from huggingface"
        )
        logger.info('Model and tokenizer loaded!')

        
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