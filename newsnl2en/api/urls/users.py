from django.urls import path
import api.views.users as views

urlpatterns = [    
    path('', views.getAllUsers, name='api-user-all'),
    path('new/', views.createUser, name='api-user-create'),
    path('<pk>/edit/', views.updateUser, name='api-user-update'),
    path('<pk>/delete/', views.deleteUser, name='api-user-delete'),
    path('<pk>/', views.getUser, name="api-user-get"),
]