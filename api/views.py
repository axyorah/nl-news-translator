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

# --- Tag ---
@api_view(['GET'])
def getAllTags(request):
    res = {}
    try:
        # authenticate
        if not request.user.is_authenticated:
            res['errors'] = 'You need to be logged view tags'
            return Response(res, status=status.HTTP_401_UNAUTHORIZED)
        
        profile = request.user.profile    
        tags = profile.tag_set.all()
    
        # get required info
        res['data'] = [tag.id for tag in tags]
        print(res['data'])

    except Exception as e:
        print(e)
        res['errors'] = e.args[0]
        return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        res['data'] = tag.json()
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
            res['data'] = tag.json()
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
            res['data'] = tag.json()
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


# --- Note ---
@api_view(['GET'])
def getAllNotes(request):
    res = {}
    try:
        # authenticate
        if not request.user.is_authenticated:
            res['errors'] = 'You need to be logged view notes'
            return Response(res, status=status.HTTP_401_UNAUTHORIZED)
        
        profile = request.user.profile    
        notes = profile.note_set.all()
    
        # get required info
        res['data'] = [note.id for note in notes]
        print(res['data'])

    except Exception as e:
        print(e)
        res['errors'] = e.args[0]
        return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)

@api_view(['GET'])
def getNote(request, pk):
    res = {}

    try:
        # authenticate
        if not request.user.is_authenticated:
            res['errors'] = 'You need to be logged view notes'
            return Response(res, status=status.HTTP_401_UNAUTHORIZED)
        profile = request.user.profile
    
        # get note
        if not Note.objects.filter(id=pk):
            res['errors'] = f'Note with id {pk} not found'
            return Response(res, status=status.HTTP_404_NOT_FOUND)
        note = Note.objects.get(id=pk)
    
        # check if authorized
        if not profile.note_set.filter(id=pk):
            res['errors'] = f'User {profile.username} is not authorized to view note {pk}'
            return Response(res, status=status.HTTP_403_FORBIDDEN)
    
        # get required info
        res['data'] = note.json()
        print(note)

    except Exception as e:
        print(e)
        res['errors'] = e.args[0]
        return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)


@api_view(['POST'])
def createNote(request):
    res = {}
    if request.method == 'POST':
        try: 
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You need to be logged in to add notes'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)
            profile = request.user.profile

            # get note
            body = request.data #json.loads(request.body)
            side_a = body['side_a']
            side_b = body['side_b']

            # check if [side_a, owner_id] is already in db
            if (profile.note_set.filter(side_a=side_a)):
                res['errors'] = f'User {profile} already has note `{side_a} -> {side_b}`, aborting'
                return Response(res, status=status.HTTP_409_CONFLICT)

            # create note
            # note ref is creaed when the note is saved!
            note = Note.objects.create(side_a=side_a, side_b=side_b)
            note.owner = request.user.profile
            note.save()

            msg = f'Created new note `{side_a} -> {side_b}` by {profile}'
            res['data'] = note.json()
            res['message'] = msg
            print(msg)

        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    print(res)
    return Response(res)
    

@api_view(['PUT'])
def updateNote(request, pk):
    res = {}

    if request.method == 'PUT':
        try:
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You have to be logged in to modify notes'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)
            
            profile = request.user.profile

            # get note
            note = Note.objects.get(id=pk)

            # check if user is authorized to change this note
            if not profile.note_set.filter(id=note.id):
                res['errors'] = f'User {profile.username} is not authorized to modify note {note.id}'
                return Response(res, status=status.HTTP_403_FORBIDDEN)
            
            # update, recall: we can only modify tag name field!
            body = request.data
            side_a_old, side_a_new = note.side_a, body['side_a']
            side_b_old, side_b_new = note.side_b, body['side_b']
            note.side_a = side_a_new
            note.side_b = side_b_new
            note.save()

            msg = f'Modified note `{side_a_old} -> {side_b_old}` ---> `{side_a_new} -> {side_b_new}` by {profile}'
            res['data'] = note.json()
            res['message'] = msg
            print(msg)
        
        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    print(res)
    return Response(res)


@api_view(['DELETE'])
def deleteNote(request, pk):
    res = {}

    if request.method == 'DELETE':
        try:
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You have to be logged in to modify notes'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)
            
            profile = request.user.profile

            # get note
            note = Note.objects.get(id=pk)

            # check if user is authorized to change this note
            if not profile.note_set.filter(id=note.id):
                res['errors'] = f'User {profile.username} is not authorize to modify note {note.id}'
                return Response(res, status=status.HTTP_403_FORBIDDEN)

            # delete
            msg = f'Deleted note `{note}` by {profile}'
            note.delete()

            res['message'] = msg
            print(msg)
        
        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)
            

# --- User ---
@api_view(['GET'])
def getAllUsers(request):
    res = {}
    try:
        # authenticate
        if not request.user.is_authenticated:
            res['errors'] = 'You need to be logged in to view users'
            return Response(res, status=status.HTTP_401_UNAUTHORIZED)

        # check if authorized
        if not request.user.is_staff:
            res['errors'] = 'Only admin can view all users'
            return Response(res, status=status.HTTP_403_FORBIDDEN)
        
        profiles = Profile.objects.all()
    
        # get required info
        res['data'] = [profile.id for profile in profiles]
        print(res['data'])

    except Exception as e:
        print(e)
        res['errors'] = e.args[0]
        return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)


@api_view(['GET'])
def getUser(request, pk):
    res = {}

    try:
        # authenticate
        if not request.user.is_authenticated:
            res['errors'] = 'You need to be logged view user info'
            return Response(res, status=status.HTTP_401_UNAUTHORIZED)

        # check if authorized:
        if not str(request.user.profile.id) == str(pk) and not request.user.is_staff:
            res['errors'] = 'You can only view your own profile'
            return Response(res, status=status.HTTP_403_FORBIDDEN)

        profile = Profile.objects.get(id=pk)
    
        # get required info
        res['data'] = profile.json()
        print(profile.json().get('username'))

    except Exception as e:
        print(e)
        res['errors'] = e.args[0]
        return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)


@api_view(['POST'])
def createUser(request):
    """admin only!"""
    res = {}
    if request.method == 'POST':
        try: 
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You need to be logged in to create new user'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)

            # check if authorized
            if not request.user.is_staff:
                res['errors'] = 'Only admin can create new user'
                return Response(res, status=status.HTTP_403_FORBIDDEN)

            # get user data
            body = request.data
            username = body['username']

            # create blank user profile
            profile = Profile.objects.create(username=username)
            profile.save()

            msg = f'Created new user {username}'
            res['data'] = profile.json()
            res['message'] = msg
            print(msg)

        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    print(res)
    return Response(res)
    

@api_view(['PUT'])
def updateUser(request, pk):
    res = {}

    if request.method == 'PUT':
        try:
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You have to be logged in to modify profile'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)
            
            # check if authorized:
            if not request.user.profile.id == pk and not request.user.is_staff:
                res['errors'] = 'You can only update your own profile'
                return Response(res, status=status.HTTP_403_FORBIDDEN)

            profile = Profile.objects.get(id=pk)

            # it should only possible to update profile_picture!
            body = request.data
            picture_old, picture_new = profile.profile_picture, body['profile_picture']
            profile.profile_picture = picture_new
            profile.save()

            msg = f'Modified profile picture {picture_old} -> {picture_new} by {profile}'
            res['data'] = profile.json()
            res['message'] = msg
            print(msg)
        
        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    print(res)
    return Response(res)


@api_view(['DELETE'])
def deleteUser(request, pk):
    """
    It is only possible to delete own account 
    """
    res = {}

    if request.method == 'DELETE':
        try:
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You have to be logged in to modify profile'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)
            
            # check if authorized:
            if not request.user.profile.id == pk and not request.user.is_staff:
                res['errors'] = 'You can only delete your own profile'
                return Response(res, status=status.HTTP_403_FORBIDDEN)

            profile = Profile.objects.get(id=pk)

            # delete
            msg = f'Deleted user {profile}'
            profile.delete()

            res['message'] = msg
            print(msg)
        
        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)
