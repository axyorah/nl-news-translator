from django.urls import path, include
from users import views

urlpatterns = [
    path('login', views.loginUser, name='login'),
    path('logout', views.logoutUser, name='logout'),
    path('', views.profile, name='profile'),    
]