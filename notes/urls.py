from django.urls import path, include
from notes import views

urlpatterns = [
    path('new/', views.createNote, name='note-create'),
]