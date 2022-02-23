from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name='api-routes'),
    path('paragraphs/', views.getParagraphs, name='api-news-paragraphs'),
    path('translations/', views.getTranslations, name='api-translations'),
    path('tags/new/', views.createTag, name='api-tag-create'),
    path('tags/<pk>/edit/', views.updateTag, name='api-tag-update'),
    path('tags/<pk>/delete/', views.deleteTag, name='api-tag-delete'),
    path('tags/<pk>/', views.getTag, name="api-tag-get")
]