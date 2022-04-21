from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.contrib.auth.models import User

from api.serializers import UserSerializer

@api_view(['GET'])
def getUserProfile(request):
    user = request.user # fetched using provided JWT token!
    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)