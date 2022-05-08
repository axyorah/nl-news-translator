from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpRequest


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
