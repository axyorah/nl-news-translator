from django.urls import path
import api.views.general as views

urlpatterns = [
    path('', views.getRoutes, name='api-routes'),
    path('news/', views.getAllNews, name='api-news'),
    path('news/selected/', views.getSelectedNews, name='api-selected-news'),
    path('news/translate/', views.getTranslations, name='api-translations'),
]