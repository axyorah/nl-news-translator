from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name='api-routes'),
    path('paragraphs/', views.getParagraphs, name='api-news-paragraphs'),
    path('translations/', views.getTranslations, name='api-translations'),
    path('tags/new/', views.createTag, name='api-tag-create'),
    path('tags/<pk>/edit/', views.updateTag, name='api-tag-update'),
    path('tags/<pk>/delete/', views.deleteTag, name='api-tag-delete'),
    path('tags/<pk>/', views.getTag, name="api-tag-get"),
    path('notes/new/', views.createNote, name='api-note-create'),
    path('notes/<pk>/edit/', views.updateNote, name='api-note-update'),
    path('notes/<pk>/delete/', views.deleteNote, name='api-note-delete'),
    path('notes/<pk>/', views.getNote, name="api-note-get"),
]