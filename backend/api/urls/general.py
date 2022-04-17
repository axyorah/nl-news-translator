from django.urls import path
import api.views.general as views

urlpatterns = [
    path('', views.getRoutes, name='api-routes'),    
]