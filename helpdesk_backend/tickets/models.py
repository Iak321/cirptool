# tickets/models.py
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = 'Categories'

class Ticket(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('pending', 'Pending'),
        ('solved', 'Solved'),
    )
    incidents = models.ManyToManyField("self", blank=True, symmetrical=False, related_name="related_tickets")
    SEVERITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='created_tickets'
    )
    
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name='assigned_tickets',
        null=True, 
        blank=True
    )
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='low')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_ongoing = models.BooleanField(default=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return self.title

class Attachment(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Attachment for {self.ticket.title}"
    

    def __str__(self):
        return f"{self.sender.username}: {self.content[:30]}"