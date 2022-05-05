from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, exceptions
from django.http import HttpRequest, Http404
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from api.serializers import UserSerializer, UserSerializerWithToken


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAllUsers(request: HttpRequest):
    try:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)

    except exceptions.APIException as e:
        print(e)
        return Response(
            { 'errors': e.detail }, 
            status=e.status_code
        )

    except Exception as e:
        print(e)
        return Response(
            { 'errors': e.args[0] }, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def registerUser(request: HttpRequest):
    try:
        data = request.data
        user = User.objects.create(
            username=data['username'],
            password=make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
    
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except exceptions.APIException as e:
        print(e)
        return Response(
            { 'errors': e.detail }, 
            status=e.status_code
        )
        
    except Exception as e:
        return Response(
            {'errors': e.args[0]}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request: HttpRequest):
    try:
        user = request.user # fetched using provided JWT token!
        serializer = UserSerializerWithToken(user, many=False)
    
        return Response(serializer.data)

    except exceptions.APIException as e:
        print(e)
        return Response(
            { 'errors': e.detail }, 
            status=e.status_code
        )

    except Exception as e:
        print(e)
        return Response(
            {'errors': e.args[0]}, 
            status=status.HTTP_400_BAD_REQUEST
        )