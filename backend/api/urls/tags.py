from django.urls import path

from api.views import tags as views


urlpatterns = [
    path('', views.TagList.as_view()),
    path('<str:pk>/', views.TagDetail.as_view())
]