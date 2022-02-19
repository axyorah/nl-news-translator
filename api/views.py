from tkinter import E
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .utils.scrap_utils import source2paragraphs
from .utils.translation_utils import NlToEnTranslator

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
        {'POST': '/api/translations'}
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


@api_view(['GET'])
def getTag(request, pk):
    res = {}

    try:
        # authenticate
        if not request.user.is_authenticated:
            res['errors'] = 'You need to be logged view tags'
            return Response(res, status=status.HTTP_401_UNAUTHORIZED)
        profile = request.user.profile
    
        # get tag
        if not Tag.objects.filter(id=pk):
            res['errors'] = f'Tag with id {pk} not found'
            return Response(res, status=status.HTTP_404_NOT_FOUND)
        tag = Tag.objects.get(id=pk)
    
        # check if authorized
        if not profile.tag_set.filter(id=pk):
            res['errors'] = f'User {profile.username} is not authorized to view tag {pk}'
            return Response(res, status=status.HTTP_403_FORBIDDEN)
    
        # get required info
        res['tag'] = tag.json()
        print(tag)

    except Exception as e:
        print(e)
        res['errors'] = e.args[0]
        return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)


@api_view(['POST'])
def createTag(request):
    res = {}
    if request.method == 'POST':
        try: 
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You need to be logged in to add tags'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)
            profile = request.user.profile

            # get tag
            body = request.data #json.loads(request.body)
            name = body['name']

            # check if [tagname, owner_id] is already in db
            if (profile.tag_set.filter(name=name)):
                res['errors'] = f'User {profile} already has tag {name}, aborting'
                return Response(res, status=status.HTTP_409_CONFLICT)

            # create tag without ref to note;
            # note ref is creaed when the note is saved!
            tag = Tag.objects.create(name=name)
            tag.owner = request.user.profile
            tag.save()

            msg = f'Created new tag {name} by {profile}'
            res['tag'] = tag.json()
            res['message'] = msg
            print(msg)

        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    print(res)
    return Response(res)
    

@api_view(['PUT'])
def updateTag(request, pk):
    res = {}

    if request.method == 'PUT':
        try:
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You have to be logged in to modify tags'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)
            
            profile = request.user.profile

            # get tag
            tag = Tag.objects.get(id=pk)

            # check if user is authorized to change this tag
            if not profile.tag_set.filter(id=tag.id):
                res['errors'] = f'User {profile.username} is not authorized to modify tag {tag.id}'
                return Response(res, status=status.HTTP_403_FORBIDDEN)
            
            # update, recall: we can only modify tag name field!
            body = request.data
            name_old, name_new = tag.name, body['name']
            tag.name = name_new
            tag.save()

            msg = f'Modified tag {name_old} -> {name_new} by {profile}'
            res['tag'] = tag.json()
            res['message'] = msg
            print(msg)
        
        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    print(res)
    return Response(res)


@api_view(['DELETE'])
def deleteTag(request, pk):
    res = {}

    if request.method == 'DELETE':
        try:
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You have to be logged in to modify tags'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)
            
            profile = request.user.profile

            # get tag
            tag = Tag.objects.get(id=pk)

            # check if user is authorized to change this tag
            if not profile.tag_set.filter(id=tag.id):
                res['errors'] = f'User {profile.username} is not authorize to modify tag {tag.id}'
                return Response(res, status=status.HTTP_403_FORBIDDEN)

            # delete
            msg = f'Deleted tag {tag.name} by {profile}'
            tag.delete()

            res['message'] = msg
            print(msg)
        
        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)


            


