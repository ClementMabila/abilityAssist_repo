from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, RouteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Route

class RouteListCreate(generics.ListCreateAPIView):
    serializer_class = RouteSerializer
    permission_classes = (IsAuthenticated,)  # Fixed syntax error

    def get_queryset(self):
        user = self.request.user
        return Route.objects.filter(logged_user=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(logged_user=self.request.user)
        else:
            print(serializer.errors)

class RouteDelete(generics.DestroyAPIView):
    serializer_class = RouteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Route.objects.filter(logged_user=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
