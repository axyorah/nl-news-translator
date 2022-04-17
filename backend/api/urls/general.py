from django.urls import path
import api.views.general as views

urlpatterns = [
    path('', views.getRoutes, name='api-routes'), 
    path('news/', views.getNews, name='api-news'),
    path('translate/', views.getTranslations, name='api-translations'),
]