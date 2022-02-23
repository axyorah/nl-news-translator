from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.conf import settings

from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm

from django.contrib import messages

from django.contrib.auth.models import User
from users.models import Profile

from users.forms import ProfileForm

# Create your views here.

def loginUser(request):

    try:
        if request.method == 'POST':
            username = request.POST['username']
            password = request.POST['password']
            
            # check if in db
            try:
                profile = Profile.objects.get(username=username)
            except Exception as e:
                print(e)
                print(f'User `{username}` does not exist!')
                messages.error(request, 'Wrong Username or Password!')
                return redirect('news')
    
            # check if username and password match
            user = authenticate(request, username=username, password=password)
            if user is not None:
                # create session for user and add it to browser cookies
                login(request, user)
                messages.success(request, f'Welcome back, {user.username}!')
                return redirect('profile')
            else:
                messages.error(request, 'Wrong Username or Password!')
                return redirect('news')
        
        context = {
            'page': 'login'
        }
        return render(request, 'users/login_registration.html', context)

    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')

def logoutUser(request):
    logout(request)
    messages.info(request, 'Bye!')
    return redirect('news')

def registerUser(request):

    try:
        form = UserCreationForm()
    
        if request.method == "POST":
            username = request.POST['username']
    
            # check if username in db
            try:
                user = User.objects.get(username=username)
                if user is not None:
                    messages.error(request, f'Username `{username}` already exists!')
                    return redirect('login')
            finally:
                form = UserCreationForm(request.POST, request.FILE)
                if form.is_valid():
                    # save
                    user = form.save(commit=False)
                    user.username = user.username.lower()
                    user.save()
    
                    # confirm, login, redirect
                    login(request, user)
                    messages.success(request, f'Welcome, {user.username}!')
                    return redirect('profile')
                else:
                    messages.error(request, form.error_messages)
                    return render(
                        request, 
                        'users/login_registration.html', 
                        {'page': 'register', 'form': form}
                    ) # <-- stay on the page, show errors
        
        context = {
            'page': 'register', 
            'form': form
        }
        return render(request, 'users/login_registration.html', context)

    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')


@login_required(login_url='login')
def profile(request):
    try:
        profile = request.user.profile
        context = {
            'profile': profile
        }
        return render(request, 'users/profile.html', context)

    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')

@login_required(login_url='login')
def updateProfile(request):
    try:
        profile = request.user.profile
        form = ProfileForm(instance=profile) # <-- autofills!!!
        
        if request.method == 'POST':
            form = ProfileForm(
                request.POST, 
                request.FILES, # <-- this used to be `request.FILE`???
                instance=profile
            )
            if form.is_valid():
                form.save()
                return redirect('profile')
    
        context = {
            'profile': profile,
            'form': form,
        }
        return render(request, 'users/profile_form.html', context)

    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')