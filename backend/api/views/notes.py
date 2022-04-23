from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

from api.models import Note
from api.serializers import NoteSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAllUserNotes(request):
    user = request.user

    notes = Note.objects.filter(owner=user)
    serializer = NoteSerializer(notes, many=True)

    return Response(serializer.data)

