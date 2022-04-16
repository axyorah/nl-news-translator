from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.conf import settings

from django.contrib import messages

import json

from .utils import (
    NewsRequester,
    newsform2params
)

news_requester = NewsRequester(settings.NEWSAPI_KEY)


def index(request):
    try:
        context = {
            'categories': [
                'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'
            ]
        }
    
        if request.method == 'POST':
    
            print('news/views.py -> index: request.POST')
            print(request.POST)
    
            params = newsform2params(request.POST)
            res = news_requester.get(**params)
            context['articles'] = res.get('articles')
    
        return render(request, 'news/news.html', context)

    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')
