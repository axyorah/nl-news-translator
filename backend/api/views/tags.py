from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

from api.models import Tag
from api.serializers import TagSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAllUserTags(request):
    user = request.user

    tags = Tag.objects.filter(owner=user)
    serializer = TagSerializer(tags, many=True)

    return Response(serializer.data)
