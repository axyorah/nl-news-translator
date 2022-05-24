from typing import List, Tuple, Set, Dict, Union, Optional

import os
import logging

from transformers import MarianMTModel, MarianTokenizer


logger = logging.getLogger(__name__)


def singleton(cls):
    instances = {}
    def instantiate(*args, **kwargs):
        if not instances:
            instances['cls'] = cls(*args, **kwargs)
        return instances['cls']
            
    return instantiate

@singleton
class NlToEnTranslator:
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

    def __init__(self):
        self.model_name = "Helsinki-NLP/opus-mt-nl-en"

        cwd = os.path.join("backend", "api", "utils")
        self.model_local_path = os.path.join(cwd, "saves", "model")
        self.tokenizer_local_path = os.path.join(cwd, "saves", "tokenizer")

        self.load_model_and_tokenizer()

    def load_model_and_tokenizer(self):
        os.makedirs(self.model_local_path, exist_ok=True)
        os.makedirs(self.tokenizer_local_path, exist_ok=True)

        # load model from local store (if exists) or from huggingface
        if all(
            os.path.exists( os.path.join(self.model_local_path, fname) ) 
            for fname in self.MODEL_FILES
        ):
            logger.info(f"Loading {self.model_name} from local storage...")
            self.model = MarianMTModel.from_pretrained(self.model_local_path)
        else:
            logger.info(f"Loading {self.model_name} from huggingface...")
            self.model = MarianMTModel.from_pretrained(self.model_name)
            self.model.save_pretrained(self.model_local_path)

        # load tokenizer from local store (if exists) or from huggingface
        if all(
            os.path.exists( os.path.join(self.tokenizer_local_path, fname) )
            for fname in self.TOKENIZER_FILES
        ):
            logger.info(f"Loading tokenizer from local storage...")
            self.tokenizer = MarianTokenizer.from_pretrained(self.tokenizer_local_path)
        else:
            logger.info(f"Loading tokenizer from huggingface...")
            self.tokenizer = MarianTokenizer.from_pretrained(self.model_name)
            self.tokenizer.save_pretrained(self.tokenizer_local_path)

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