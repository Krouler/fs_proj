from django.contrib.auth.models import User
from django.db import models


class Post(models.Model):
    user = models.ForeignKey(User, related_name='posts', null=True, blank=True, on_delete=models.SET_NULL)
    caption = models.CharField(max_length=128, blank=False, verbose_name='Заголовок')
    description = models.TextField(max_length=1500, blank=False, verbose_name='Текст поста')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата и время создания', blank=True)
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата и время обновления поста', blank=True)

    def __str__(self):
        return self.caption

    @property
    def created_by(self):
        return f'{self.user.profile.last_name} {self.user.profile.first_name}'

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'


class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', null=True, blank=True, verbose_name='Пост', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='comments', null=True, blank=True, verbose_name='Пользователь', on_delete=models.SET_NULL, )
    text = models.TextField(max_length=500, verbose_name='Текст коментария', blank=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, verbose_name='Дата и время создания комментария')
    updated_at = models.DateTimeField(auto_now=True, blank=True, verbose_name='Дата и время обновления комментария')

    def __str__(self):
        if len(self.text) > 15:
            return f'{self.user.username}: {self.text[:15]}...'
        return f'{self.user.username}: {self.text}'

    @property
    def commented_by(self):
        return f'{self.user.profile.last_name} {self.user.profile.first_name}'

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'

