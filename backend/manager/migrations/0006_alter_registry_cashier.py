# Generated by Django 4.0.2 on 2022-02-22 18:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('manager', '0005_registry_cashier'),
    ]

    operations = [
        migrations.AlterField(
            model_name='registry',
            name='cashier',
            field=models.CharField(default='', max_length=150),
        ),
    ]