from django.urls import path
from .views import PickupPointAPIView, calculate_shipping

urlpatterns = [
    path('points/', PickupPointAPIView.as_view(), 
         name='point-list'),
    path('calculate-shipping/', calculate_shipping,
         name='calculate-shipping')
]