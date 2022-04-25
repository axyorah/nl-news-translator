from urllib.error import HTTPError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.core.paginator import Paginator
from rest_framework import exceptions

from api.models import Note
from api.serializers import NoteSerializer

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

