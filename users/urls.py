from django.urls import path, include
from users import views

urlpatterns = [
    path('', views.profile, name='profile'),
]