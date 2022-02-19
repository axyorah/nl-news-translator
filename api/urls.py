from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name='api-routes'),
    path('paragraphs/', views.getParagraphs, name='news-paragraphs'),
    path('translations/', views.getTranslations, name='translations'),
    path('tags/new/', views.createTag, name='tag-create'),
    path('tags/<pk>/edit/', views.updateTag, name='tag-update'),
    path('tags/<pk>/delete/', views.deleteTag, name='tag-delete'),
    path('tags/<pk>/', views.getTag, name="tag-get")
]