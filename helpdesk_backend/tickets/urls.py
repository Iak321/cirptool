# tickets/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CveSearchView
from . import views

router = DefaultRouter()
router.register(r'tickets', views.TicketViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'attachments', views.AttachmentViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # ✅ ADD THIS DEBUG ROUTE
    path('debug-auth/', views.DebugAuthView.as_view(), name='debug-auth'),

    # Existing custom actions
    path('tickets/create/', views.TicketViewSet.as_view({'post': 'create_ticket'}), name='ticket-create'),
    path('tickets/incidents/', views.TicketViewSet.as_view({'get': 'incidents'}), name='ticket-incidents'),
    path('tickets/user_tickets/', views.TicketViewSet.as_view({'get': 'user_tickets'}), name='user-tickets'),
    path('search-cve/', CveSearchView.as_view(), name='search-cve'),
]