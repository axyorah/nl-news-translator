from django.urls import path

from api.views import notes as views


urlpatterns = [
    path('', views.NoteList.as_view(), name='note-list'),
    path('<str:pk>/', views.NoteDetail.as_view(), name='note-detail')
]