from django.urls import path
import api.views.news as views

urlpatterns = [
    path('', views.getAllNews, name='news'),
    path('selected/', views.getSelectedNews, name='news-selected'),
    path('translate/', views.getTranslations, name='news-translations'),
]