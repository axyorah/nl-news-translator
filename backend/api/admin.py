from django.contrib import admin
from api.models import Note, Tag

# Register your models here.
admin.site.register(Note)
admin.site.register(Tag)