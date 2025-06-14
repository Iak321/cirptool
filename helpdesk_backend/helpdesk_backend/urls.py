# helpdesk_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView  # Add this import
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from tickets.views import TicketViewSet, CategoryViewSet, AttachmentViewSet
from chats.views import MessageViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'attachments', AttachmentViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include('tickets.urls')),
    path('api/tickets/', include('tickets.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('api/chats/', include('chats.urls')),
    
    # Add a URL pattern for the root path - choose one of these options:
    
    # Option 1: Redirect to the admin site
    path('', RedirectView.as_view(url='admin/', permanent=False)),
    
    # Option 2: Redirect to the API root
    #path('', RedirectView.as_view(url='api/', permanent=False)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)