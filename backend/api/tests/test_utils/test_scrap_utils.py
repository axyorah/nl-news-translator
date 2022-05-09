from django.test import TestCase

from api.utils.scrap_utils import NOSScrapper


class NOSScrapperTests(TestCase):

    def setUp(self) -> None:
        self.scrapper = {
            'nos.nl': NOSScrapper()
        }

    def tearDown(self) -> None:
        self.scrapper = None

    def test_nos_scrap_ok(self):
        url = 'https://nos.nl/index.php/l/2417100'
        parargaphs_tru = [
            "In Brussel heeft een man vlak na het verlaten van de gevangenis een dakloze man in brand gestoken bij het Zuidstation. Dat is gebeurd in de nacht van vrijdag op zaterdag en is vastgelegd door bewakingscamera's op het station, melden Belgische media waaronder Sudinfo.",
            "Volgens de nieuwssite verliet de man vrijdag na acht maanden de gevangenis. Het zou gaan om een Poolse man van 34 jaar die vastzat voor een reeks diefstallen.",
            "Op de beelden is te zien hoe de Pool rond 03.30 uur een slapende dakloze man in brand steekt, die hij met kranten had bedekt. Het slachtoffer, ook van Poolse afkomst, liep zware brandwonden aan zijn rug op. Hij is naar het brandwondencentrum van het Militair Hospitaal Koningin Astrid in Neder-Over-Heembeek gebracht.",
            "De verdachte werd al snel gearresteerd in de buurt van het Zuidstation. RTL info schrijft dat de twee mannen elkaar net hadden ontmoet en dat ze te veel hadden gedronken. Belgische media melden dat de verdachte het vuur aanstak om de ander \"op te warmen\"."
        ]

        paragraphs = self.scrapper['nos.nl'].get_article(url)
        self.assertEqual(paragraphs, parargaphs_tru)
