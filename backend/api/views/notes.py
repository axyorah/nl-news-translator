from typing import List, Dict, Optional, Union
from django.http import HttpRequest
from django.conf import settings
from django.core.paginator import Paginator

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, exceptions

from api.models import Note
from api.serializers import NoteSerializer
from api.forms import NoteForm


def try_except(view):
    def helper(*args, **kwargs):
        try:
            return view(*args, **kwargs)

        except Note.DoesNotExist as e:
            print(e)
            return Response({ 'errors': e.args[0], 'detail': e.args[0] }, status=status.HTTP_404_NOT_FOUND)
    
        except exceptions.APIException as e:
            print(e)
            return Response({ 'errors': e.detail, 'detail': e.detail }, status=e.status_code)

        except AssertionError as e:
            print(e)
            return Response({'errors': e.args[0], 'detail': e.args[0]}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(e)
            return Response({ 'errors': e.args[0], 'detail': e.args[0] }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return helper


class NoteList(APIView):
    """get list of all user note or create a new note"""
    @permission_classes([IsAuthenticated])
    @try_except
    def get(self, request: HttpRequest):
        user = request.user

        if not user or not user.is_authenticated:
            raise exceptions.NotAuthenticated('You must be logged in to view notes')

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
    
    @permission_classes([IsAuthenticated])
    @try_except
    def post(self, request: HttpRequest):
        user = request.user

        if not user or not user.is_authenticated:
            raise exceptions.NotAuthenticated('You must be logged in to create notes')
        
        # create new note
        note_form = NoteForm(request.data)

        # fugly constraint on tags visible for `this` note:
        # this constraint should be added during model creation via `Membership`,
        # but that creates errors for some reason...
        note_form.fields['tags'].queryset = user.tag_set.all()

        if note_form.is_valid():
            # update form fields
            note = note_form.save(commit=False)
            note.owner = user

            # update m2m
            note.save()
            note_form.save_m2m()

        else:
            raise Exception('Note creation failed')

        serializer = NoteSerializer(note, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class NoteDetail(APIView):
    """get, update, delete user note"""
    @permission_classes([IsAuthenticated])
    @try_except
    def get(self, request: HttpRequest, pk: str):
        user = request.user
        if not user or not user.is_authenticated:
            raise exceptions.NotAuthenticated('You must be logged in to view notes')

        note = user.note_set.get(id=pk)
        serializer = NoteSerializer(note, many=False)
        return Response(serializer.data)    

    @permission_classes([IsAuthenticated])
    @try_except
    def put(self, request: HttpRequest, pk: str):
        user = request.user
        if not user or not user.is_authenticated:
            raise exceptions.NotAuthenticated('You must be logged in to update notes')

        note = user.note_set.get(id=pk)
        note_orig = user.note_set.get(id=pk)

        # make sure that we're updating existing note instead of creating new
        note_form = NoteForm(request.data, instance=note_orig)

        # fugly constraint on tags visible for `this` note:
        # this constraint should be added during model creation via `Membership`,
        # but that creates errors for some reason...
        note_form.fields['tags'].queryset = user.tag_set.all()

        if note_form.is_valid():
            # update form fields
            note = note_form.save(commit=False)

            # update m2m
            note.save()
            note_form.save_m2m()

        else:
            raise Exception('Note update failed')

        serializer = NoteSerializer(note, many=False)
        return Response(serializer.data)

    @permission_classes([IsAuthenticated])
    @try_except
    def delete(self, request: HttpRequest, pk: str,):
        user = request.user
        if not user or not user.is_authenticated:
            raise exceptions.NotAuthenticated('You must be logged in to delete notes')

        note = user.note_set.get(id=pk)
        note.delete()

        return Response({'id': pk})
