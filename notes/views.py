from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from django.contrib import messages

from notes.models import Note, Tag, Membership
from notes.forms import NoteForm, TagForm

@login_required(login_url='login')
def showNotes(request):
    # TODO: paging
    profile = request.user.profile

    # all notes 
    notes = profile.note_set.order_by('created')

    if request.method == 'POST':
        # filter notes by tags
        tagNames = [name for name in request.POST if name != 'csrfmiddlewaretoken']
        tags = Tag.objects.filter(owner=profile, name__in=tagNames)
        notes = notes & Note.objects.filter(tags__in=tags)

    context = {
        'notes': notes,
    }

    return render(request, 'notes/note-list.html', context)

@login_required(login_url='login')
def getNote(request, pk):
    profile = request.user.profile

    # chec if note exists
    if not Note.objects.filter(id=pk):
        messages.error('Note not found :(')
        return render(request, 'notes/note.html')
    note = Note.objects.get(id=pk)

    # check if authorized
    if not profile.note_set.filter(id=pk):
        messages.error('You are not authorized to see this note')
        return render(request, 'note/note.html')

    context = {
        'note': note
    }

    return render(request, 'notes/note.html', context)


# Create your views here.
@login_required(login_url='login')
def createNote(request):
    profile = request.user.profile
    noteForm = NoteForm()
    tagForm = TagForm()

    # fugly constraint on tags visible for `this` note:
    # this constraint should be added during model creation via `Membership`,
    # but that creates errors for some reason...
    noteForm.fields['tags'].queryset = profile.tag_set.all()

    if request.method == 'POST':
        print(request.POST)
        noteForm = NoteForm(request.POST)
        if noteForm.is_valid():
            note = noteForm.save(commit=False)
            note.owner = profile
            note.save()
            noteForm.save_m2m() # <-- save tags !!!

            #tags = noteForm.cleaned_data.get('tags')
            #print(tags)
            #print(note.tag_set.all())

            return redirect('profile')
        else:
            print(noteForm)
            messages.error(request, 'Note creation failed :(')

    context = {
        'noteForm': noteForm,
        'tagForm': tagForm
    }    
    return render(request, 'notes/note-form.html', context)

@login_required(login_url='login')
def updateNote(request, pk):
    note = Note.objects.get(id=pk)
    context = {}
    # TODO: ...
    return render(request, 'notes/note.html', context)

@login_required(login_url='login')
def deleteNote(request, pk):
    # TODO: ...
    return redirect('profile')

# @login_required(login_url='login')
# def createTag(request, pk):
#     # DO IT THROUGH API!
#     form = TagForm()
#     note = Note.objects.get(id=pk)

#     if request.method == 'POST':
#         form = TagForm(request.POST)
#         if form.is_valid():
#             tag = form.save(commit=False)
#             tag.owner = request.user.profile
#             tag.note = note
#             tag.save()
#         else:
#             messages.error(request, 'Tag data is not valid')

#     context = {
#         'tagForm': form,
#     }

#     return render(request, 'notes/note.html', context)
    

