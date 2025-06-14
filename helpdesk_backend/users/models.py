# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    USER_TYPES = (
        ('admin', 'Admin'),
        ('support', 'IT Support'),
        ('employee', 'Employee'),
    )
    
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='employee')
    department = models.CharField(max_length=100, blank=True)
    
    # Override the related_name for groups and user_permissions
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='custom_user_set',
        related_query_name='custom_user',
        help_text='The groups this user belongs to.',
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='custom_user_set',
        related_query_name='custom_user',
        help_text='Specific permissions for this user.',
    )
    
    def __str__(self):
        return self.username