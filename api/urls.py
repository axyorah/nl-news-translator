from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name='api-routes'),
    path('paragraphs/', views.getParagraphs, name='api-news-paragraphs'),
    path('translations/', views.getTranslations, name='api-translations'),
    
    path('tags/', views.getAllTags, name='api-tag-all'),
    path('tags/new/', views.createTag, name='api-tag-create'),
    path('tags/<pk>/edit/', views.updateTag, name='api-tag-update'),
    path('tags/<pk>/delete/', views.deleteTag, name='api-tag-delete'),
    path('tags/<pk>/', views.getTag, name="api-tag-get"),    

    path('notes/', views.getAllNotes, name='api-note-all'),
    path('notes/new/', views.createNote, name='api-note-create'),
    path('notes/<pk>/edit/', views.updateNote, name='api-note-update'),
    path('notes/<pk>/delete/', views.deleteNote, name='api-note-delete'),
    path('notes/<pk>/', views.getNote, name="api-note-get"),
    
    path('users/', views.getAllUsers, name='api-user-all'),
    path('users/new/', views.createUser, name='api-user-create'),
    path('users/<pk>/edit/', views.updateUser, name='api-user-update'),
    path('users/<pk>/delete/', views.deleteUser, name='api-user-delete'),
    path('users/<pk>/', views.getUser, name="api-user-get"),
]