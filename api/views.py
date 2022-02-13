from multiprocessing.sharedctypes import Value
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .utils import source2paragraphs

import json
import requests as rq

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
        {'POST': '/api/translates'}
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

    print(f'api: getParagraphs fun in views')
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