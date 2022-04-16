from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return render(request, 'index.html')

def server_error(request):
    return render(request, 'error.html')