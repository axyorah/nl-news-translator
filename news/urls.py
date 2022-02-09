from django.urls import path, include
from news import views

urlpatterns = [
    path('news/', views.index, name='news'),
]