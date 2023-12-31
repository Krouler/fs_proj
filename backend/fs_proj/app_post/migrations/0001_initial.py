# Generated by Django 4.2.3 on 2023-07-05 09:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('caption', models.CharField(max_length=128, verbose_name='Заголовок')),
                ('description', models.TextField(max_length=1500, verbose_name='Текст поста')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата и время создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата и время обновления поста')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='posts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Пост',
                'verbose_name_plural': 'Посты',
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(max_length=500, verbose_name='Текст коментария')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата и время создания комментария')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата и время обновления комментария')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='app_post.post', verbose_name='Пост')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='comments', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Комментарий',
                'verbose_name_plural': 'Комментарии',
            },
        ),
    ]
