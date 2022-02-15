from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.conf import settings

from users.models import Profile

# Create your views here.

def loginUser(request):
    
    if request.method == 'POST':
        username = request.POST['username']
        profile = Profile.objects.get(username=username)
        return redirect('profile', pk=profile.id)
    
    context = {}
    return render(request, 'users/login_registration.html', context)

def profile(request, pk):
    profile = Profile.objects.get(id=pk)
    context = {
        'profile': profile
    }
    return render(request, 'users/profile.html', context)