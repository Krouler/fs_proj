from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.http import Http404
from django.shortcuts import render
from rest_framework import mixins
from rest_framework.generics import GenericAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED
from rest_framework.viewsets import ViewSet, GenericViewSet

from app_auth.models import Profile
from app_auth.permissions import NotAuthenticated, ReadOnly, IsOwnerOrReadOnly
from app_auth.serializer import CreateUserSerializer, RetrieveUserInfoSerializer, RetrieveUserProfile


class RegistrationApiView(CreateAPIView):
    model = get_user_model()
    permission_classes = (NotAuthenticated,)
    serializer_class = CreateUserSerializer

    def perform_create(self, serializer):
        profile_data = dict(serializer.validated_data.get('profile'))
        print(profile_data)
        username = serializer.validated_data.get('username')
        print(username)
        serializer.save()
        user = User.objects.get(username=username)
        print(user)
        temp_for_print = Profile.objects.create(user_id=user.id, **profile_data)
        print(temp_for_print)
        temp_for_print.save()


class MyPageViewSet(mixins.UpdateModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    permission_classes = (IsOwnerOrReadOnly,)
    queryset = User.objects.all()
    serializer_class = RetrieveUserInfoSerializer
    http_method_names = ['get', 'put', 'patch', 'options', 'head']

    def get_object(self):
        if self.request.method == 'GET':
            return self.request.user
        return self.request.user.profile

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return RetrieveUserInfoSerializer
        return RetrieveUserProfile

    def retrieve(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'detail': 'need authentication to perform', 'status': '401'}, status=HTTP_401_UNAUTHORIZED)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'detail': 'need authentication to perform', 'status': '401'}, status=HTTP_401_UNAUTHORIZED)
        return super().update(request, *args, **kwargs)

