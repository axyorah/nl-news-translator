from django.db import models
import uuid
from django.contrib.auth.models import User

# Create your models here.
class Note(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    created = models.DateTimeField(auto_now_add=True)

    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    side_a = models.TextField(null=True, blank=True)
    side_b = models.TextField(null=True, blank=True)

    tags = models.ManyToManyField('Tag', blank=True) 

    def json(self, tag=False):
        return {
            'id': str(self.id),
            'created': self.created.isoformat(),
            'owner': str(self.owner.id),
            'side_a': str(self.side_a),
            'side_b': str(self.side_b),
            'tags': [
                tagObj.json() if tag else tagObj.id
                for tagObj in self.tags.all()
            ] if self.tags else []
        }

    def __str__(self):
        return (
            f'{self.side_a[:50] if self.side_a else ""}... -> '
            f'{self.side_b[:50] if self.side_b else ""}...'
        )

    class Meta:
        ordering = ['-created']

class Tag(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    created = models.DateField(auto_now_add=True)

    name = models.CharField(max_length=200)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def json(self, note=False):
        return {
            'id': str(self.id),
            'created': self.created.isoformat(),
            'name': str(self.name),
            'owner': str(self.owner.id),
            'notes': [
                noteObj.json() if note else noteObj.id
                for noteObj in self.notes.all()
            ] if self.notes else []
        }

    def __str__(self):
        return str(self.name)

    class Meta:
        unique_together = [['owner', 'name']]