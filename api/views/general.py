from tkinter import E
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.utils.scrap_utils import source2paragraphs
from api.utils.translation_utils import NlToEnTranslator

from users.models import Profile
from notes.models import Tag, Note

import json

nl2en = NlToEnTranslator()

def validate_paragraphs_query(params):
    if not params.get('source') or not params.get('url'):
        raise ValueError(
            f'Query string should contain "source" and "url" fields; '
            f'got {json.dumps(params)}'
        )

    if not isinstance(params['source'], str):
        raise TypeError(f'"source" should be a string')

    if not isinstance(params['url'], str):
        raise TypeError(f'"url" should be a string')

    if not params['source'] in source2paragraphs.keys():
        raise ValueError(
            f'"source" should be one of {list(source2paragraphs.keys())}; '
            f'got {params["source"]}'
        )

@api_view(['GET'])
def getRoutes(request):
    routes = [
        {'GET': '/api/paragraphs'},
        {'POST': '/api/translations'},
        
        {'GET': '/api/tags/'},
        {'POST': '/api/tags/new/'},        
        {'PUT': '/api/tags/<pk>/edit/'},
        {'DELETE': '/api/tags/<pk>/delete/'},
        {'GET': '/api/tags/<pk>/'},
        
        {'GET': '/api/notes/'},
        {'POST': '/api/notes/new/'},
        {'PUT': '/api/notes/<pk>/edit/'},
        {'DELETE': '/api/notes/<pk>/delete/'},
        {'GET': '/api/notes/<pk>/'},

        {'GET': '/api/users/'}, # admin only
        {'POST': '/api/users/new/'}, # admin only
        {'PUT': '/api/users/<pk>/edit/'}, # self only
        {'DELETE': '/api/users/<pk>/delete/'}, # self only
        {'GET': '/api/users/<pk>/'} # self only
    ]

    return Response(routes)

@api_view(['GET'])
def getParagraphs(request):
    params = request.GET

    try:
        validate_paragraphs_query(params)
    except Exception as e:
        print(e)
        return Response({'errors': e.args[0]})

    print(f'api/views.py -> getParagraphs:')
    print(f'url: {params["url"]}, source: {params["source"]}')

    if params.get('source') and params['source'] in source2paragraphs: 
        paragraphs = source2paragraphs[params['source']](params['url'])
    else:
        paragraphs = []

    res = {
        'data': paragraphs
    }

    print(res)

    return Response(res)


@api_view(['POST'])
def getTranslations(request):

    res = {}

    if request.method == 'POST':    
        try:
            body = request.data # json.loads(request.body) # <-- only read once!
            sentences = body['sentences']

            translations = nl2en.translate(sentences)
            res['translations'] = translations
    
        except Exception as e:
            print(f'Error: {e}')

    return Response(res)