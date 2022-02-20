from django.urls import path, include
from notes import views

urlpatterns = [
    path('', views.showNotes, name='note-list'),
    path('new/', views.createNote, name='note-create'),
    path('<pk>/', views.getNote, name='note'),
    path('<pk>/edit/', views.updateNote, name='note-update'),
    path('<pk>/delete/', views.deleteNote, name='note-delete'),
]   