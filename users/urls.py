from django.urls import path, include
from users import views

urlpatterns = [
    path('<str:pk>', views.profile, name='profile'),    
]