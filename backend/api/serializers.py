from rest_framework.response import Response
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.models import User

from backend.api.models import Note, Tag


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

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'isAdmin',
            'token'
        ]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

class NoteSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = [
            'id',
            'created',
            'owner',
            'side_a',
            'side_b',
            'tags'
        ]

    def get_created(self, obj: Note):
        return obj.created.isoformat()

    def get_tags(self, obj: Note):
        return obj.tags.all() or []

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = [
            'id',
            'created',
            'name',
            'owner'
        ]
