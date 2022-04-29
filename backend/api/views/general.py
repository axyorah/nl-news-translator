from tkinter import E
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpRequest, Http404
from rest_framework import status, exceptions
from django.conf import settings
import json

from api.utils.news_utils import NewsRequester
from api.utils.scrap_utils import source2paragraphs
from api.utils.translation_utils import NlToEnTranslator


news_requester = NewsRequester(settings.NEWSAPI_KEY)
nl2en = NlToEnTranslator()

def validate_news_query(params):
    #TODO: proper param validation
    return 

@api_view(['GET'])
def getRoutes(request: HttpRequest):
    routes = [
        {'GET': '/api/'},

        {'GET': '/api/news/'},
        {'GET': '/api/news/selected/?source=<source>&url=<url>'},
        {'POST': '/api/translate/'},
        
        {'GET': '/api/tags/'},
        {'POST': '/api/tags/'},
        {'GET': '/api/tags/<pk>/'},
        {'PUT': '/api/tags/<pk>/'},
        {'DELETE': '/api/tags/<pk>/'},
        
        {'GET': '/api/notes/[?page=<page_num>&tags=<tag_id1>,<tag_id2>]'},
        {'POST': '/api/notes/'},
        {'GET': '/api/notes/<pk>/'},
        {'PUT': '/api/notes/<pk>/'},
        {'DELETE': '/api/notes/<pk>/'},

        {'GET': '/api/users/'}, # admin only
        {'POST': '/api/users/new/'},
        {'POST': '/api/users/login/'},
        {'GET': '/api/users/profile/'} # self only
    ]

    return Response(routes)

@api_view(['GET'])
def getAllNews(request: HttpRequest):

    try:
        q = request.GET.get('q', None)
        categories = request.GET.get('category_list', None)
        
        params = {
            'q': q,
            'category_list': categories.split(',') if categories is not None else None
        }

        validate_news_query(params)
        res = news_requester.get(**params)
        
        return Response(res)

    except exceptions.APIException as e:
            print(e)
            return Response(
                { 'errors': e.detail }, 
                status=e.status_code
            )    

    except Exception as e:
        print(e)
        # (setting status code to default 200, so that that the 
        # custom error msg can be properly intercepted in frontend)
        return Response({'errors': e.args[0]})#, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def getSelectedNews(request: HttpRequest):

    try:
        source = request.GET.get('source', None)
        url = request.GET.get('url', None)
        
        if source is None or url is None:
            raise Exception(
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

    except exceptions.APIException as e:
        print(e)
        return Response(
            { 'errors': e.detail }, 
            status=e.status_code
        )

    except Exception as e:
        print(e)
        # (setting it to default 200, so that that the 
        # custom error msg can be properly intercepted in frontend)
        return Response({'errors': e.args[0]})#, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def getTranslations(request: HttpRequest):

    try:
        body = request.data 
        sentences = body['sentences']

        # translate sentence-by-sentence to reduce mem requirement
        translations = [
            nl2en.translate([sentence])
            for sentence in sentences
        ]
        res = { 'translations': translations }
        return Response(res)

    except exceptions.APIException as e:
        print(e)
        return Response(
            { 'errors': e.detail }, 
            status=e.status_code
        )    

    except Exception as e:
        print(e)
        # (setting it to default 200, so that that the 
        # custom error msg can be properly intercepted in frontend)
        return Response({ 'errors': e.args[0] })#, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    