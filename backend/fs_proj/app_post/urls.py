from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter

from app_post.views import PostViewSet, CommentViewSet

routerPost = DefaultRouter()
#routerComment = SimpleRouter()
routerPost.register(r'post', PostViewSet)
#routerComment.register('post/<int:pk_post>/comment', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(routerPost.urls)),
    path('post/<int:pk_post>/comment/', CommentViewSet.as_view({'get': 'list', 'post': 'create'}), name='comment-list'),
    path('post/<int:pk_post>/comment/<int:pk_comment>/', CommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='comment-detail')
]
