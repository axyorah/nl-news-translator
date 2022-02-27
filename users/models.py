from django.db import models
from django.contrib.auth.models import User
import uuid

# Create your models here.
class Profile(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    created = models.DateTimeField(auto_now_add=True)

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    username = models.CharField(max_length=200, blank=True, null=True)
    profile_picture = models.ImageField(
        null=True, 
        blank=True, 
        upload_to='profiles/', 
        default='profiles/default-profile-picture.png'
    )

    def json(self):
        return {
            'id': str(self.id),
            'created': self.created.isoformat(),
            'user': str(self.user.id),
            'username': str(self.username),
            'profile_picture': getattr(self.profile_picture, 'url', 'None') \
                if self.profile_picture else 'None',
            'notes': [
                note.json() for note in self.notes.all()
            ] if self.notes else [],
            'tags': [
                tag.json() for tag in self.tags.all()                
            ] if self.tags else []
        }

    def __str__(self):
        return str(self.user.username)
