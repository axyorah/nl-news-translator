from tkinter import E
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
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
def getRoutes(request):
    routes = [
        {'GET': '/api/'},

        {'GET': '/api/news/'},
        {'GET': '/api/news/:url/'},
        {'POST': '/api/translate/'},
        
        # {'GET': '/api/tags/'},
        # {'POST': '/api/tags/new/'},        
        # {'PUT': '/api/tags/<pk>/edit/'},
        # {'DELETE': '/api/tags/<pk>/delete/'},
        # {'GET': '/api/tags/<pk>/'},
        
        # {'GET': '/api/notes/'},
        # {'POST': '/api/notes/new/'},
        # {'PUT': '/api/notes/<pk>/edit/'},
        # {'DELETE': '/api/notes/<pk>/delete/'},
        # {'GET': '/api/notes/<pk>/'},

        {'POST': '/api/users/login/'},
        # {'GET': '/api/users/'}, # admin only
        # {'POST': '/api/users/new/'}, # admin only
        # {'PUT': '/api/users/<pk>/edit/'}, # self only
        # {'DELETE': '/api/users/<pk>/delete/'}, # self only
        # {'GET': '/api/users/<pk>/'} # self only
    ]

    return Response(routes)

@api_view(['GET'])
def getAllNews(request):

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

    except Exception as e:
        print(f'ERROR: {e}')
        res = {'errors': e.args[0]}
        # TODO: return proper status code 
        # (setting it to default 200, so that that the 
        # custom error msg can be properly intercepted in frontend)
        return Response(res)#, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def getSelectedNews(request):

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
        res = { 'paragraphs': paragraphs }
        
        return Response(res)

    except Exception as e:
        print(f'ERROR: {e}')
        res = {'errors': e.args[0]}
        # TODO: return proper status code 
        # (setting it to default 200, so that that the 
        # custom error msg can be properly intercepted in frontend)
        return Response(res)#, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def getTranslations(request):

    if request.method == 'POST':
        try:
            body = request.data 
            sentences = body['sentences']

            translations = nl2en.translate(sentences)
            res = { 'translations': translations }
            return Response(res)
    
        except Exception as e:
            print(f'ERROR: {e}')
            res = { 'errors': e.args[0] }
            # TODO: return proper status code 
            # (setting it to default 200, so that that the 
            # custom error msg can be properly intercepted in frontend)
            return Response(res)#, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    return Response({ 'errors': 'only `POST` method is supported for this route'})
