from typing import List, Dict, Optional, Union
from django.http import HttpRequest
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import exceptions

from api.models import Tag
from api.serializers import TagSerializer
from api.forms import TagForm


def try_except(view):
    def helper(*args, **kwargs):
        try:
            return view(*args, **kwargs)

        except Tag.DoesNotExist as e:
            print(e)
            return Response({ 'errors': e.args[0] }, status=status.HTTP_404_NOT_FOUND)

        except exceptions.APIException as e:
            print(e)
            return Response({ 'errors': e.detail }, status=e.status_code)

        except Exception as e:
            print(e)
            return Response({ 'errors': e.args[0] }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return helper


class TagList(APIView):
    """get list of all user tags or create a new tag"""
    @permission_classes([IsAuthenticated])
    @try_except
    def get(self, request: HttpRequest):
        user = request.user
        if not user or not user.is_authenticated:
            raise exceptions.NotAuthenticated('You must be logged in to view tags')

        tags = user.tag_set.all()
        serializer = TagSerializer(tags, many=True)
    
        return Response({'tags': serializer.data})
    
    @permission_classes([IsAuthenticated])
    @try_except
    def post(self, request: HttpRequest):
        user = request.user

        if not user or not user.is_authenticated:
            raise exceptions.NotAuthenticated('You must be logged in to create tags')
       
        # create new tag
        tag_form = TagForm(request.data)

        if tag_form.is_valid():
            # update form fields
            tag = tag_form.save(commit=False)
            tag.owner = user
            tag.save()

        else:
            raise Exception('Note creation failed')

        serializer = TagSerializer(tag, many=False)
        return Response(serializer.data)


class TagDetail(APIView):
    """get, update, delete user tag"""
    @permission_classes([IsAuthenticated])
    @try_except
    def get(self, request: HttpRequest, pk: str):
        user = request.user
        if not user or not user.is_authenticated:
            raise exceptions.NotAuthenticated('You must be logged in to view tags')

        tag = user.tag_set.get(id=pk)
        serializer = TagSerializer(tag, many=False)
        return Response(serializer.data)    

    @permission_classes([IsAuthenticated])
    @try_except
    def put(self, request: HttpRequest, pk: str):
        user = request.user
        if not user or not user.is_authenticated:
            raise exceptions.NotAuthenticated('You must be logged in to update tags')

        tag = user.tag_set.get(id=pk)
        tag_orig = user.tag_set.get(id=pk)

        # make sure that we're updating existing tag instead of creating new
        tag_form = TagForm(request.data, instance=tag_orig)

        if tag_form.is_valid():
            # update form fields
            tag = tag_form.save(commit=False)

            # update m2m
            tag.save()
            tag_form.save_m2m()

        else:
            raise Exception('Tag update failed')

        serializer = TagSerializer(tag, many=False)
        return Response(serializer.data)

    @permission_classes([IsAuthenticated])
    @try_except
    def delete(self, request: HttpRequest, pk: str,):
        user = request.user
        if not user or not user.is_authenticated:
            raise exceptions.NotAuthenticated('You must be logged in to delete tags')

        tag = user.tag_set.get(id=pk)
        tag.delete()

        return Response({'id': pk})
