from django.contrib import admin
from backend.api.models import Note, Tag

# Register your models here.
admin.site.register(Note)
admin.site.register(Tag)