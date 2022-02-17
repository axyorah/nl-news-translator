from django import forms
from django.forms.models import inlineformset_factory

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
        widgets = {
            'tags': forms.CheckboxSelectMultiple(),
        }

class TagForm(ModelForm):
    class Meta:
        model = Tag
        fields = [
            'name'
        ]
