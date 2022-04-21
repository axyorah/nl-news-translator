from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from api.views import users as views


urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('profile/', views.getUserProfile, name='user'),
    path('', views.getAllUsers, name='all-users'),
]