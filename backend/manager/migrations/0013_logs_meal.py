# Generated by Django 4.0.2 on 2023-03-29 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('manager', '0012_logs'),
    ]

    operations = [
        migrations.AddField(
            model_name='logs',
            name='meal',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]