from tkinter import E
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from users.models import Profile


@api_view(['GET'])
def getAllUsers(request):
    res = {}
    try:
        # authenticate
        if not request.user.is_authenticated:
            res['errors'] = 'You need to be logged in to view users'
            return Response(res, status=status.HTTP_401_UNAUTHORIZED)

        # check if authorized
        if not request.user.is_staff:
            res['errors'] = 'Only admin can view all users'
            return Response(res, status=status.HTTP_403_FORBIDDEN)
        
        profiles = Profile.objects.all()
    
        # get required info
        res['data'] = [profile.id for profile in profiles]
        print(res['data'])

    except Exception as e:
        print(e)
        res['errors'] = e.args[0]
        return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)


@api_view(['GET'])
def getUser(request, pk):
    res = {}

    try:
        # authenticate
        if not request.user.is_authenticated:
            res['errors'] = 'You need to be logged view user info'
            return Response(res, status=status.HTTP_401_UNAUTHORIZED)

        # check if authorized:
        if not str(request.user.profile.id) == str(pk) and not request.user.is_staff:
            res['errors'] = 'You can only view your own profile'
            return Response(res, status=status.HTTP_403_FORBIDDEN)

        profile = Profile.objects.get(id=pk)
    
        # get required info
        res['data'] = profile.json()
        print(profile.json().get('username'))

    except Exception as e:
        print(e)
        res['errors'] = e.args[0]
        return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)


@api_view(['POST'])
def createUser(request):
    """admin only!"""
    res = {}
    if request.method == 'POST':
        try: 
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You need to be logged in to create new user'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)

            # check if authorized
            if not request.user.is_staff:
                res['errors'] = 'Only admin can create new user'
                return Response(res, status=status.HTTP_403_FORBIDDEN)

            # get user data
            body = request.data
            username = body['username']

            # create blank user profile
            profile = Profile.objects.create(username=username)
            profile.save()

            msg = f'Created new user {username}'
            res['data'] = profile.json()
            res['message'] = msg
            print(msg)

        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    print(res)
    return Response(res)
    

@api_view(['PUT'])
def updateUser(request, pk):
    res = {}

    if request.method == 'PUT':
        try:
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You have to be logged in to modify profile'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)
            
            # check if authorized:
            if not request.user.profile.id == pk and not request.user.is_staff:
                res['errors'] = 'You can only update your own profile'
                return Response(res, status=status.HTTP_403_FORBIDDEN)

            profile = Profile.objects.get(id=pk)

            # it should only possible to update profile_picture!
            body = request.data
            picture_old, picture_new = profile.profile_picture, body['profile_picture']
            profile.profile_picture = picture_new
            profile.save()

            msg = f'Modified profile picture {picture_old} -> {picture_new} by {profile}'
            res['data'] = profile.json()
            res['message'] = msg
            print(msg)
        
        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    print(res)
    return Response(res)


@api_view(['DELETE'])
def deleteUser(request, pk):
    """
    It is only possible to delete own account 
    """
    res = {}

    if request.method == 'DELETE':
        try:
            # authenticate
            if not request.user.is_authenticated:
                res['errors'] = 'You have to be logged in to modify profile'
                return Response(res, status=status.HTTP_401_UNAUTHORIZED)
            
            # check if authorized:
            if not request.user.profile.id == pk and not request.user.is_staff:
                res['errors'] = 'You can only delete your own profile'
                return Response(res, status=status.HTTP_403_FORBIDDEN)

            profile = Profile.objects.get(id=pk)

            # delete
            msg = f'Deleted user {profile}'
            profile.delete()

            res['message'] = msg
            print(msg)
        
        except Exception as e:
            print(e)
            res['errors'] = e.args[0]
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(res)