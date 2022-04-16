from tkinter import E
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from users.models import Profile
from notes.models import Tag, Note

import json

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