from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings

import json

from .utils import (
    NewsRequester,
    newsform2params
)

news_requester = NewsRequester(settings.NEWSAPI_KEY)


def index(request):
    context = {
        'categories': [
            'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'
        ]
    }

    if request.method == 'POST':

        params = newsform2params(request.POST)
        res = news_requester.get(**params)
        context['posts'] = json.dumps(res, indent=4)

    return render(request, 'news/news.html', context)
