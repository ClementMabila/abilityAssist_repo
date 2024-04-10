from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Route

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'last_name', 'email', 'password', 'confirm_password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        confirm_password = validated_data.pop('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match")

        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ["id", "location", "destination", "created_at", "logged_user"]
        extra_kwargs = {'user': {'write_only': True}}