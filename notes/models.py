from django.db import models
import uuid

from users.models import Profile

# Create your models here.
class Note(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    created = models.DateTimeField(auto_now_add=True)

    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True)
    side_a = models.TextField(null=True, blank=True)
    side_b = models.TextField(null=True, blank=True)

    tags = models.ManyToManyField('Tag', blank=True)

    def __str__(self):
        return f'{self.side_a[:50]}... -> {self.side_b[:50]}...'

class Tag(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    created = models.DateField(auto_now_add=True)

    name = models.CharField(max_length=200)
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.name} by {self.owner.username}'
