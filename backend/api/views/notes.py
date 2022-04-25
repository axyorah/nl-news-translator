from urllib.error import HTTPError
from typing import List, Dict, Optional, Union
from django.forms import ValidationError
from django.http import HttpRequest
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.core.paginator import Paginator
from rest_framework import exceptions

from api.models import Note, Tag
from api.serializers import NoteSerializer, TagSerializer
from api.forms import NoteForm, TagForm


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAllUserNotes(request):
    try: 
        user = request.user

        # params
        page_string = request.GET.get('page')
        tags_string = request.GET.get('tags', None)

        page = int(page_string) if page_string is not None and page_string.isnumeric() else 1
        tags = tags_string.split(',') if tags_string is not None else []

        # notes with specific tags (if specified)
        if tags:
            notes = user.note_set.filter(tags__in=tags).distinct()
        else:
            notes = user.note_set.all()

        # current page notes
        paginator = Paginator(notes, 5)

        # adjust page number if needed
        if page <= 0:
            page = 1
        elif page > int(paginator.num_pages):
            page = paginator.num_pages
        
        # serialize
        serializer = NoteSerializer(paginator.page(page), many=True)
    
        return Response({ 
            'notes': serializer.data,
            'page': page,
            'num_pages': paginator.num_pages
        })

    except exceptions.APIException as e:
        return Response({ 'errors': e.detail }, status=e.status_code)
    
    except Exception as e:
        print(e)
        return Response({ 'errors': e.args[0] }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)        


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserNote(request, pk):
    try:
        user = request.user
        note = user.note_set.get(id=pk)
        serializer = NoteSerializer(note, many=False)

        return Response(serializer.data)

    except Note.DoesNotExist as e:
        return Response({ 'errors': e.args[0] }, status=status.HTTP_404_NOT_FOUND)

    except exceptions.APIException as e:
        return Response({ 'errors': e.detail }, status=e.status_code)

    except Exception as e:
        print(e)
        return Response({ 'errors': e.args[0] }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserNote(request: HttpRequest, pk):
    try:
        user = request.user
        note = user.note_set.get(id=pk)
        note_orig = user.note_set.get(id=pk)

        # make sure that we're updating existing note instead of creating new
        noteForm = NoteForm(request.data, instance=note_orig)

        # fugly constraint on tags visible for `this` note:
        # this constraint should be added during model creation via `Membership`,
        # but that creates errors for some reason...
        noteForm.fields['tags'].queryset = user.tag_set.all()

        if noteForm.is_valid():
            # update form fields
            note = noteForm.save(commit=False)

            # update m2m
            note.save()
            noteForm.save_m2m()

        else:
            raise Exception('Note update failed')

        serializer = NoteSerializer(note, many=False)
        return Response(serializer.data)
    
    except Note.DoesNotExist as e:
        print(e)
        return Response({ 'errors': e.args[0] }, status=status.HTTP_404_NOT_FOUND)

    except exceptions.APIException as e:
        print(e)
        return Response({ 'errors': e.detail }, status=e.status_code)

    except Exception as e:
        print(e)
        return Response({ 'errors': e.args[0] }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteUserNote(request: HttpRequest, pk):
    try:
        user = request.user
        note = user.note_set.get(id=pk)
        note.delete()
        
        return Response({'id': pk})
    
    except Note.DoesNotExist as e:
        print(e)
        return Response({ 'errors': e.args[0] }, status=status.HTTP_404_NOT_FOUND)

    except exceptions.APIException as e:
        print(e)
        return Response({ 'errors': e.detail }, status=e.status_code)

    except Exception as e:
        print(e)
        return Response({ 'errors': e.args[0] }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

