# Generated by Django 4.0.2 on 2022-02-17 20:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Breakfast',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='breakfast', max_length=50)),
                ('start_time', models.TimeField(default='07:00')),
                ('end_time', models.TimeField(default='09:00')),
                ('is_active', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Dinner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='lunch', max_length=50)),
                ('start_time', models.TimeField(default='19:00')),
                ('end_time', models.TimeField(default='22:00')),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Lunch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='lunch', max_length=50)),
                ('start_time', models.TimeField(default='12:00')),
                ('end_time', models.TimeField(default='15:00')),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Registry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('badge', models.CharField(max_length=50)),
                ('login', models.CharField(max_length=50)),
                ('image', models.URLField(max_length=255)),
                ('meal', models.CharField(choices=[('breakfast', 'breakfast'), ('lunch', 'lunch'), ('lunch', 'lunch')], max_length=50)),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('profile', models.CharField(max_length=50)),
            ],
        ),
    ]