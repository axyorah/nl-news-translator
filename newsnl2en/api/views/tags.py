from tkinter import E
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from users.models import Profile
from notes.models import Tag, Note


@api_view(['GET'])
def getAllTags(request):
    res = {}
    try:
        # authenticate
        if not request.user.is_authenticated:
            res['errors'] = 'You need to be logged view tags'
            return Response(res, status=status.HTTP_401_UNAUTHORIZED)
        
        profile = request.user.profile    
        tags = profile.tag_set.all()
    
        # get required info
        res['data'] = [tag.id for tag in tags]
        print(res['data'])

    except Exception as e:
        print(e)
        res['errors'] = e.args[0]
        return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)


@api_view(['GET'])
def getTag(request, pk):
    res = {}

    try:
        # authenticate
        if not request.user.is_authenticated:
            res['errors'] = 'You need to be logged view tags'
            return Response(res, status=status.HTTP_401_UNAUTHORIZED)
        profile = request.user.profile
    
        # get tag
        if not Tag.objects.filter(id=pk):
            res['errors'] = f'Tag with id {pk} not found'
            return Response(res, status=status.HTTP_404_NOT_FOUND)
        tag = Tag.objects.get(id=pk)
    
        # check if authorized
        if not profile.tag_set.filter(id=pk):
            res['errors'] = f'User {profile.username} is not authorized to view tag {pk}'
            return Response(res, status=status.HTTP_403_FORBIDDEN)
    
        # get required info
        res['data'] = tag.json()
        print(tag)

    except Exception as e:
        print(e)
        res['errors'] = e.args[0]
        return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)


@api_view(['POST'])
def createTag(request):
    res = {}
    if request.method == 'POST':
        try: 
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You need to be logged in to add tags'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)
            profile = request.user.profile

            # get tag
            body = request.data #json.loads(request.body)
            name = body['name']

            # check if [tagname, owner_id] is already in db
            if (profile.tag_set.filter(name=name)):
                res['errors'] = f'User {profile} already has tag {name}, aborting'
                return Response(res, status=status.HTTP_409_CONFLICT)

            # create tag without ref to note;
            # note ref is creaed when the note is saved!
            tag = Tag.objects.create(name=name)
            tag.owner = request.user.profile
            tag.save()

            msg = f'Created new tag {name} by {profile}'
            res['data'] = tag.json()
            res['message'] = msg
            print(msg)

        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    print(res)
    return Response(res)
    

@api_view(['PUT'])
def updateTag(request, pk):
    res = {}

    if request.method == 'PUT':
        try:
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You have to be logged in to modify tags'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)
            
            profile = request.user.profile

            # get tag
            tag = Tag.objects.get(id=pk)

            # check if user is authorized to change this tag
            if not profile.tag_set.filter(id=tag.id):
                res['errors'] = f'User {profile.username} is not authorized to modify tag {tag.id}'
                return Response(res, status=status.HTTP_403_FORBIDDEN)
            
            # update, recall: we can only modify tag name field!
            body = request.data
            name_old, name_new = tag.name, body['name']
            tag.name = name_new
            tag.save()

            msg = f'Modified tag {name_old} -> {name_new} by {profile}'
            res['data'] = tag.json()
            res['message'] = msg
            print(msg)
        
        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    print(res)
    return Response(res)


@api_view(['DELETE'])
def deleteTag(request, pk):
    res = {}

    if request.method == 'DELETE':
        try:
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You have to be logged in to modify tags'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)
            
            profile = request.user.profile

            # get tag
            tag = Tag.objects.get(id=pk)

            # check if user is authorized to change this tag
            if not profile.tag_set.filter(id=tag.id):
                res['errors'] = f'User {profile.username} is not authorize to modify tag {tag.id}'
                return Response(res, status=status.HTTP_403_FORBIDDEN)

            # delete
            msg = f'Deleted tag {tag.name} by {profile}'
            tag.delete()

            res['message'] = msg
            print(msg)
        
        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)
