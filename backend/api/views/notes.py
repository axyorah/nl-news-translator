from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.core.paginator import Paginator

from api.models import Note
from api.serializers import NoteSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAllUserNotes(request):
    try: 
        user = request.user

        # params
        tag_id = request.GET.get('tag', None)
        page = request.GET.get('page', 1)

        # notes with specific tag (if specified)
        if tag_id is not None:
            notes = user.note_set.filter(tags__id=tag_id)
        else:
            notes = user.note_set.all()

        # current page notes
        paginator = Paginator(notes, 5)

        # adjust page number if needed
        if isinstance(page, str) and not page.isnumeric():
            page = 1
        elif int(page) <= 0:
            page = 1
        elif int(page) > int(paginator.num_pages):
            page = paginator.num_pages
        page = int(page)
        
        # serialize
        serializer = NoteSerializer(paginator.page(page), many=True)
    
        return Response({ 
            'notes': serializer.data,
            'page': page,
            'num_pages': paginator.num_pages
        })
    
    except Exception as e:
        print(e)
        return Response({ 'errors': e.args[0] })        

