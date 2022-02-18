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

    tags = models.ManyToManyField('Tag', blank=True) #through='Membership', 

    def json(self):
        return {
            'id': str(self.id),
            'created': str(self.created),
            'owner': str(self.owner),
            'side_a': str(self.side_a),
            'side_b': str(self.side_b),
            'tags': [tag.json() for tag in self.tags]
        }

    def __str__(self):
        return f'{self.side_a[:50] if self.side_a else ""}... -> {self.side_b[:50] if self.side_b else ""}...'

class Tag(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    created = models.DateField(auto_now_add=True)

    name = models.CharField(max_length=200)
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True)

    def json(self):
        return {
            'id': str(self.id),
            'created': str(self.created),
            'name': str(self.name),
            'owner': str(self.owner)
        }

    def __str__(self):
        return f'{self.name} by {self.owner.username if self.owner else "undefined"}'


# this should be used to constrain tags available for note 
# to tags that were created by note's owner only;
# this creates errors when migration, however, 
# so just leaving it here unreferenced for now...
class Membership(models.Model):
    owner = models.ForeignKey(Profile, blank=True, null=True, on_delete=models.CASCADE)
    note = models.ForeignKey('Note', blank=True, null=True, on_delete=models.DO_NOTHING)
    tag = models.ForeignKey('Tag', blank=True, null=True, on_delete=models.DO_NOTHING)

