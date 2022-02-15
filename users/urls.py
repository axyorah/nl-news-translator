from django.urls import path, include
from users import views

urlpatterns = [
    path('login', views.loginUser, name='login'),
    path('<str:pk>', views.profile, name='profile'),    
]