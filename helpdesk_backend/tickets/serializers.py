from rest_framework import serializers
from django.db import transaction
from .models import Ticket, Category, Attachment
from users.models import User
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['id', 'file', 'uploaded_at']


class TicketSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)
    incidents = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'created_by', 'assigned_to',
            'category', 'status', 'severity', 'created_at', 'updated_at',
            'is_ongoing', 'start_date', 'end_date', 'attachments', 'incidents'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TicketCreateSerializer(serializers.ModelSerializer):
    attachments = serializers.ListField(
        child=serializers.FileField(),
        required=False,
        write_only=True
    )
    incidents = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Ticket.objects.all(),
        required=False
    )
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False
    )

    class Meta:
        model = Ticket
        fields = [
            'title', 'description', 'category', 'severity',
            'start_date', 'end_date', 'is_ongoing',
            'attachments', 'incidents', 'assigned_to'
        ]

    def validate_attachments(self, files):
        for f in files:
            if f.size > 10 * 1024 * 1024:  # 10MB
                raise serializers.ValidationError(f"{f.name} exceeds 10MB size limit.")
            if not f.content_type.startswith('image/') and not f.content_type.endswith('pdf'):
                raise serializers.ValidationError(f"{f.name} is not a valid file type.")
        return files

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        attachments_data = validated_data.pop('attachments', [])
        incidents_data = validated_data.pop('incidents', [])
        
        ticket = Ticket.objects.create(**validated_data)
        ticket.incidents.set(incidents_data)  # ✅ assign related tickets

        for attachment in attachments_data:
            Attachment.objects.create(ticket=ticket, file=attachment)
        
        return ticket