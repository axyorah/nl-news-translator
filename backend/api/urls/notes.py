from django.urls import path

from api.views import notes as views


urlpatterns = [
    path('', views.getAllUserNotes, name='all-user-notes'),
    path('<str:pk>/', views.getUserNote, name='user-note'),
]