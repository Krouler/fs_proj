from django.shortcuts import render
from rest_framework import viewsets

from app_post.models import Post, Comment
from app_post.permissions import IsAuthenticatedOrIsOwnerOrReadOnly
from app_post.serializers import PostSerializer, CommentsSerializer


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticatedOrIsOwnerOrReadOnly,)
    queryset = Post.objects.order_by('-created_at').all()
    lookup_field = 'pk'

    def perform_create(self, serializer):
        obj = serializer.save()
        obj.user = self.request.user
        obj.save()


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentsSerializer
    permission_classes = (IsAuthenticatedOrIsOwnerOrReadOnly,)
    lookup_url_kwarg = 'pk_comment'

    def get_queryset(self):
        if self.queryset is None:
            self.queryset = Post.objects.get(id=self.kwargs.get('pk_post')).comments.all()
        return self.queryset

    def perform_create(self, serializer):
        obj = serializer.save()
        obj.post = Post.objects.get(id=self.kwargs.get('pk_post'))
        obj.user = self.request.user
        obj.save()
