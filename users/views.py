from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings

# Create your views here.

def loginOrRegister(request):
    context = {}
    return render(request, 'users/login_registration.html', context)

def profile(request):
    context = {}
    return render(request, 'users/profile.html', context)