from django.forms import ModelForm
from notes.models import Note, Tag

class NoteForm(ModelForm):
    class Meta:
        model = Note
        fields = [
            'side_a',
            'side_b',
            'tags'
        ]

class TagForm(ModelForm):
    class Meta:
        model = Tag
        fields = [
            'name'
        ]