from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.conf import settings

from django.contrib.auth import login, authenticate

from users.models import Profile

# Create your views here.

def loginUser(request):

    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        # check if in db
        try:
            profile = Profile.objects.get(username=username)
        except Exception as e:
            print(e)
            print(f'User `{username}` does not exist!')
            return redirect('news')

        # check if username and password match
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # create session for user and add it to browser cookies
            login(request, user)
            profile = Profile.objects.get(username=username)
            return redirect('profile', pk=profile.id)
        else:
            print('username or password is incorrect')
            # TODO add flash message
            return redirect('news')
    
    context = {}
    return render(request, 'users/login_registration.html', context)

def logoutUser(request):
    return redirect('news')

def profile(request, pk):
    profile = Profile.objects.get(id=pk)
    context = {
        'profile': profile
    }
    return render(request, 'users/profile.html', context)