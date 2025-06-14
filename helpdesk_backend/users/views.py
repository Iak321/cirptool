# users/views.py
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action == 'create' or self.action == 'login':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        return UserSerializer
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            # Create or get token
            token, _ = Token.objects.get_or_create(user=user)
            
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key,
                'message': 'Login successful'
            })
        return Response(
            {'message': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        # Delete the token to logout
        if request.user.is_authenticated:
            Token.objects.filter(user=request.user).delete()
        return Response({'message': 'Logout successful'})
    
    @action(detail=False, methods=['get'])
    def current_user(self, request):
        if request.user.is_authenticated:
            return Response(UserSerializer(request.user).data)
        return Response(
            {'message': 'Not authenticated'},
            status=status.HTTP_401_UNAUTHORIZED
        )