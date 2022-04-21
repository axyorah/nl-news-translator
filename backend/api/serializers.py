from rest_framework.response import Response
from rest_framework import serializers

from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'isAdmin'
        ]

    def get_isAdmin(self, obj):
        return obj.is_staff