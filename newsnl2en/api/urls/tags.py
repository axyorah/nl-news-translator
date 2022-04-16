from django.urls import path
import api.views.tags as views

urlpatterns = [
    path('', views.getAllTags, name='api-tag-all'),
    path('new/', views.createTag, name='api-tag-create'),
    path('<pk>/edit/', views.updateTag, name='api-tag-update'),
    path('<pk>/delete/', views.deleteTag, name='api-tag-delete'),
    path('<pk>/', views.getTag, name="api-tag-get"),
]