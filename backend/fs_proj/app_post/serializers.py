from rest_framework import serializers

from app_post.models import Post, Comment


class CommentsSerializer(serializers.ModelSerializer):
    commented_by = serializers.CharField()

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('id', 'post', 'user', 'created_at', 'commented_by', 'updated_at')


class PostSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='post-detail', read_only=True)
    comments = CommentsSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'user_id', 'url', 'caption', 'description', 'comments', 'created_at', 'updated_at', 'created_by')
        read_only_fields = ('id', 'url', 'comments', 'created_at', 'updated_at', 'created_by')



