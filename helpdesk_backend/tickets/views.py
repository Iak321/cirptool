# tickets/views.py
import json
import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count
from django.db.models import Q
from .models import Ticket, Category, Attachment
from .serializers import (
    TicketSerializer, TicketCreateSerializer,
    CategorySerializer, AttachmentSerializer,
)
from rest_framework.views import APIView

def get_queryset(self):
    user = self.request.user
    if user.user_type in ['admin', 'support'] or user.is_staff:
        return Ticket.objects.all()
    return Ticket.objects.filter(created_by=user)


class CveSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').lower()
        results = []

        file_path = os.path.join(settings.BASE_DIR, 'tickets\cve_slim.json')  # adjust if your file is stored elsewhere

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                cves = json.load(f)

            for cve in cves:
                if query in cve['id'].lower() or query in cve['description'].lower() or query in cve.get('title', '').lower():
                    results.append(cve)
                if len(results) >= 10:
                    break

            return Response(results)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class DebugAuthView(APIView):
    def get(self, request):
        print("DEBUG AUTH - User:", request.user)
        print("DEBUG AUTH - Auth header:", request.META.get("HTTP_AUTHORIZATION"))
        return Response({"user": str(request.user)}, status=200)

class IsAdminOrSupport(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.user_type in ['admin', 'support'] or
            request.user.is_staff
        )



class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.none()  # 👈 placeholder just to satisfy DRF
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TicketSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']

    def get_queryset(self):
        user = self.request.user
        if user.user_type in ['admin', 'support'] or user.is_staff:
            return Ticket.objects.all()
        return Ticket.objects.filter(created_by=user)

    def get_serializer_class(self):
        if self.action == 'create':
            return TicketCreateSerializer
        return self.serializer_class

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['post'])
    def create_ticket(self, request):
        serializer = TicketCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            ticket = serializer.save(created_by=request.user)
            return Response(
                TicketSerializer(ticket).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def incidents(self, request):
        search_query = request.query_params.get('search', '')
        if not search_query:
            return Response([])

        queryset = self.get_queryset()
        incidents = queryset.filter(
            Q(title__icontains=search_query) | 
            Q(description__icontains=search_query)
        ).order_by('-created_at')[:10]

        return Response(TicketSerializer(incidents, many=True).data)
    
    def update(self, request, *args, **kwargs):
        ticket = self.get_object()
        user = request.user

        if ticket.created_by != user and user.user_type not in ['admin', 'support'] and not user.is_staff:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)  # Use same check
    
    

 

class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]