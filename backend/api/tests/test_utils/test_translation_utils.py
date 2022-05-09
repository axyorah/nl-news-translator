from django.test import TestCase

from api.utils.translation_utils import NlToEnTranslator


class NlToEnTranslatorTests(TestCase):

    def setUp(self) -> None:
        self.translator = NlToEnTranslator()
        self.nl = 'Deze zin moet vertaald worden naar het Engels'
        self.en = 'This phrase must be translated into English'

    def tearDown(self) -> None:
        self.translator = None

    def test_nl2en_translate_list_ok(self):
        res = self.translator.translate([self.nl])
        self.assertEqual(res, [self.en])

    def test_nl2en_translate_string_ok(self):
        res = self.translator.translate(self.nl)
        self.assertEqual(res, [self.en])