from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


# @receiver(post_save, sender=User)
# def create_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user_id=instance.id)


class Profile(models.Model):
    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE, verbose_name='Пользователь')
    first_name = models.CharField(max_length=50, null=False, blank=False, verbose_name='Имя')
    last_name = models.CharField(max_length=50, null=False, blank=False, verbose_name='Фамилия')
    email = models.CharField(max_length=120, null=False, blank=False, verbose_name='Электропочта')
    about_me = models.TextField(max_length=1500, verbose_name='Обо мне')

    def __str__(self):
        return f'{self.user.username}: {self.first_name} {self.last_name}'

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'


