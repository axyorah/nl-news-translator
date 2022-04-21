from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from api.views import users as views


urlpatterns = [
    path('', views.getAllUsers, name='all-users'),
    path('new/', views.registerUser, name='user-register'),
    path('login/', TokenObtainPairView.as_view(), name='user-login'),
    path('profile/', views.getUserProfile, name='user'),
]