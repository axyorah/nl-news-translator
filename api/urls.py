from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name='api-routes'),
    path('paragraphs/', views.getParagraphs, name='news-paragraphs'),
    path('translations/', views.getTranslations, name='translations'),
]