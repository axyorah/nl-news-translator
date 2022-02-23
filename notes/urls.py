from django.urls import path, include
from notes import views

urlpatterns = [
    path('tags/', views.showTags, name='tag-list'),
    path('tags/new/', views.createTag, name='tag-create-new'),
    path('notes/', views.showNotes, name='note-list'),
    path('notes/new/', views.createNote, name='note-create'),
    path('notes/<pk>/', views.getNote, name='note'),
    path('notes/<pk>/edit/', views.updateNote, name='note-update'),
    path('notes/<pk>/delete/', views.deleteNote, name='note-delete'),
]   