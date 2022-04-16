from django.urls import path
import api.views.notes as views

urlpatterns = [
    path('', views.getAllNotes, name='api-note-all'),
    path('new/', views.createNote, name='api-note-create'),
    path('<pk>/edit/', views.updateNote, name='api-note-update'),
    path('<pk>/delete/', views.deleteNote, name='api-note-delete'),
    path('<pk>/', views.getNote, name="api-note-get"),
]