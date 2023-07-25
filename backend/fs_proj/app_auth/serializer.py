from django.contrib.auth.models import User
from rest_framework import serializers

from app_auth.models import Profile
from app_post.models import Comment, Post


class GetUserPosts(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = '__all__'


class GetUserComments(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'


class RetrieveUserProfile(serializers.ModelSerializer):

    class Meta:
        model = Profile
        exclude = ('id',)
        read_only_fields = ('user',)


class RetrieveUserInfoSerializer(serializers.ModelSerializer):
    posts = GetUserPosts(many=True)
    comments = GetUserComments(many=True)
    profile = RetrieveUserProfile()

    class Meta:
        model = User
        fields = ('id', 'username', 'profile', 'posts', 'comments')


class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile = RetrieveUserProfile(write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )
        return user

    class Meta:
        model = User
        fields = ("id", "username", "password", "profile")
