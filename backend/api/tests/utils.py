from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from api.models import Note, Tag

def create_user(**validated_params):
    validated_params['password'] = make_password(
        validated_params['password']
    )
    return User.objects.create(**validated_params)

def create_note(**validated_params):
    return Note.objects.create(**validated_params)

def create_tag(**validated_params):
    return Tag.objects.create(**validated_params)