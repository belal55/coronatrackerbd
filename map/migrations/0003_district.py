# Generated by Django 3.0.5 on 2020-04-25 13:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0002_auto_20200425_1931'),
    ]

    operations = [
        migrations.CreateModel(
            name='District',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('jsonData', models.TextField()),
            ],
        ),
    ]
