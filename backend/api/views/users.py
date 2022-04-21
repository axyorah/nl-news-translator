from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from api.serializers import UserSerializer, UserSerializerWithToken


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAllUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    data = request.data

    user = User.objects.create(
        username=data['username'],
        password=make_password(data['password'])
    )
    serializer = UserSerializerWithToken(user, many=False)

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user # fetched using provided JWT token!
    serializer = UserSerializerWithToken(user, many=False)

    return Response(serializer.data)