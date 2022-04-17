from tkinter import E
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import json

from api.utils.news_utils import NewsRequester
from api.utils.translation_utils import NlToEnTranslator


news_requester = NewsRequester(settings.NEWSAPI_KEY)
nl2en = NlToEnTranslator()

def validate_news_query(params):
    return 

@api_view(['GET'])
def getRoutes(request):
    routes = [
        {'GET': '/api'},

        {'GET': '/api/news'},
        {'POST': '/api/translate'},
        
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

        # {'GET': '/api/users/'}, # admin only
        # {'POST': '/api/users/new/'}, # admin only
        # {'PUT': '/api/users/<pk>/edit/'}, # self only
        # {'DELETE': '/api/users/<pk>/delete/'}, # self only
        # {'GET': '/api/users/<pk>/'} # self only
    ]

    return Response(routes)

@api_view(['GET'])
def getNews(request):

    res = {}

    try:
        q = request.GET.get('q', None)
        categories = request.GET.get('category_list', None)
        
        params = {
            'q': q,
            'category_list': categories.split(',') if categories is not None else None
        }
        #params = request.GET.urlencode()
        print('PARAMS')
        print(params, type(params))
        validate_news_query(params)
        res['data'] = news_requester.get(**params)
        #res['data'] = {}
    except Exception as e:
        print(e)
        res['errors'] = e.args[0]

    return Response(res)


@api_view(['POST'])
def getTranslations(request):

    res = {}

    if request.method == 'POST':
        try:
            body = request.data 
            sentences = body['sentences']

            translations = nl2en.translate(sentences)
            res['translations'] = translations
    
        except Exception as e:
            print(f'Error: {e}')
            res['errors'] = e.args[0]

    return Response(res)