from tkinter import E
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json

from api.utils.translation_utils import NlToEnTranslator


nl2en = NlToEnTranslator()

@api_view(['GET'])
def getRoutes(request):
    routes = [
        {'GET': '/api'},

        # {'GET': '/api/news'},
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