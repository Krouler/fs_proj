from rest_framework import serializers

from app_post.models import Post, Comment


class PostSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='post-detail', read_only=True)
    comment_list = serializers.SerializerMethodField('create_comment_list')

    class Meta:
        model = Post
        fields = ('url', 'caption', 'description', 'comment_list', 'created_at', 'updated_at', 'created_by')
        read_only_fields = ('id', 'url', 'comment_list', 'created_at', 'updated_at', 'created_by')

    def create_comment_list(self, obj):
        post_comment = obj.comments.all()
        if len(post_comment) == 0:
            return {}
        dd = {}
        for n, i in enumerate(post_comment):
            dd[n] = CommentsSerializer(i).data
        return dd


class CommentsSerializer(serializers.ModelSerializer):
    commented_by = serializers.ReadOnlyField()

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('id', 'post', 'commented_by', 'user', 'created_at', 'updated_at')

