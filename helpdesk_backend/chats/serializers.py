from rest_framework import serializers
from .models import Message
from users.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'ticket', 'sender', 'sender_username', 'content', 'timestamp']
        read_only_fields = ['sender', 'timestamp']
