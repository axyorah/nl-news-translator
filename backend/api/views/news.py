from tkinter import E
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpRequest, Http404
from rest_framework import status, exceptions
from django.conf import settings

from api.utils.news_utils import NewsRequester
from api.utils.scrap_utils import source2paragraphs
from api.utils.translation_utils import NlToEnTranslator


news_requester = NewsRequester(settings.NEWSAPI_KEY)
nl2en = NlToEnTranslator()


def try_except(view):
    def helper(*args, **kwargs):
        try:
            return view(*args, **kwargs)

        except exceptions.APIException as e:
            print(e)
            return Response({ 'errors': e.detail, 'detail': e.detail }, status=e.status_code)

        except AttributeError as e:
            print(e)
            return Response({'errors': e.args[0], 'detail': e.args[0]}, status=status.HTTP_400_BAD_REQUEST)

        except AssertionError as e:
            print(e)
            return Response({'errors': e.args[0], 'detail': e.args[0]}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(e)
            return Response({ 'errors': e.args[0], 'detail': e.args[0] }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return helper

@api_view(['GET'])
@try_except
def getAllNews(request: HttpRequest):

    q = request.GET.get('q', None)
    categories = request.GET.get('category_list', None)
    
    params = {
        'q': q,
        'category_list': [
            cat.strip() for cat in categories.split(',')
        ] if categories is not None else None
    }
    
    res = news_requester.get(**params)    
    return Response(res)

@api_view(['GET'])
@try_except
def getSelectedNews(request: HttpRequest):
    source = request.GET.get('source', None)
    url = request.GET.get('url', None)

    if source is None or url is None:
        raise AttributeError(
            f'Please specify both `url` and `source` in a query string, e.g., '
            f'`/api/news/?source=nos.nl&url=<url>`'
        )

    source = source.lower()

    if (source not in source2paragraphs):
        raise Exception(
            f'Posts from `{source}` cannot be parsed yet. '
            f'Please choose one of: {", ".join(list(source2paragraphs.keys()))}'
        )
    paragraphs = source2paragraphs[source](url)
    return Response({ 'paragraphs': paragraphs })

@api_view(['POST'])
@try_except
def getTranslations(request: HttpRequest):
    body = request.data
    sentences = body['sentences']

    # translate sentence-by-sentence to reduce mem requirement
    translations = [
        nl2en.translate([sentence])[0]
        for sentence in sentences
    ]
    res = { 'translations': translations }
    return Response(res)
