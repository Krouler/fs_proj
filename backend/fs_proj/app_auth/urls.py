from django.urls import path, include
from rest_framework.routers import DefaultRouter

from app_auth.views import RegistrationApiView, MyPageViewSet

urlpatterns = [
    path('registration/', RegistrationApiView.as_view(), name='registration'),
    path('profile/me/', MyPageViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'}), name='mypage'),
]

