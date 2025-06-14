# chats/views.py
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer
from tickets.models import Ticket

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
    
    def get_queryset(self):
        ticket_id = self.request.query_params.get('ticket_id')
        if ticket_id:
            return Message.objects.filter(ticket_id=ticket_id)
        return Message.objects.none()