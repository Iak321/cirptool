# Generated by Django 5.2 on 2025-05-04 21:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='ticket',
            name='incidents',
            field=models.ManyToManyField(blank=True, related_name='related_tickets', to='tickets.ticket'),
        ),
    ]
