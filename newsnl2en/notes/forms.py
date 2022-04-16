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

        labels = {
            'side_a': 'Side A',
            'side_b': 'Side B'
        }

    def __init__(self, *args, **kwargs):
        super(NoteForm, self).__init__(*args, **kwargs)

        self.fields['side_a'].widget.attrs.update({'class': 'boxed'})
        self.fields['side_b'].widget.attrs.update({'class': 'boxed'})


class TagForm(ModelForm):
    class Meta:
        model = Tag
        fields = [
            'name'
        ]
