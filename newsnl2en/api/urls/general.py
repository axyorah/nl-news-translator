from django.urls import path
import api.views.general as views

urlpatterns = [
    path('', views.getRoutes, name='api-routes'),
    path('paragraphs/', views.getParagraphs, name='api-news-paragraphs'),
    path('translations/', views.getTranslations, name='api-translations'),    
]