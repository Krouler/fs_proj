from rest_framework import serializers

from app_post.models import Post, Comment


class CommentsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('id', 'post', 'user', 'created_at', 'updated_at')


class PostSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='post-detail', read_only=True)
    comment_list = CommentsSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'user_id', 'url', 'caption', 'description', 'comment_list', 'created_at', 'updated_at', 'created_by')
        read_only_fields = ('id', 'url', 'comment_list', 'created_at', 'updated_at', 'created_by')



