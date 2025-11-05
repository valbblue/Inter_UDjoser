from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
import uuid

from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class CustomUserCreateSerializer(UserCreateSerializer):
    acepta_politicas = serializers.BooleanField(write_only=True)

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ("id", "email", "password", "acepta_politicas")

    def create(self, validated_data):
        # Forzar rol estudiante
        validated_data["is_estudiante"] = True
        validated_data["is_admin_interu"] = False
        validated_data["is_staff"] = False
        validated_data["is_superuser"] = False

        return super().create(validated_data)

    def validate_acepta_politicas(self, value):
        if not value:
            raise serializers.ValidationError("Debe aceptar las políticas de uso para registrarse.")
        return value


class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ("id", "email", "acepta_politicas", "is_estudiante", "is_admin_interu")


