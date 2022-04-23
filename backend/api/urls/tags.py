from django.urls import path

from api.views import tags as views


urlpatterns = [
    path('', views.getAllUserTags, name='all-user-tags'),
]