from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from django.contrib import messages

from notes.models import Tag, Note
from notes.forms import TagForm, NoteForm

# Create your views here.
@login_required(login_url='login')
def createNote(request):
    profile = request.user.profile
    form = NoteForm()

    if request.method == 'POST':
        form = NoteForm(request.POST)
        if form.is_valid():
            note = form.save(commit=False)
            note.owner = profile
            # note.tags = ...
            # createTag(request, note.id) ???
            note.save()
            return redirect('profile')
        else:
            messages.error(request, 'Note creation failed :(')

    context = {
        'noteForm': form
    }    
    return render(request, 'notes/note.html', context)

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

@login_required(login_url='login')
def createTag(request, pk):
    form = TagForm()
    note = Note.objects.get(id=pk)

    if request.method == 'POST':
        form = TagForm(request.POST)
        if form.is_valid():
            tag = form.save(commit=False)
            tag.owner = request.user.profile
            tag.note = note
            tag.save()
        else:
            messages.error(request, 'Tag data is not valid')

    context = {
        'tagForm': form
    }

    return render(request, 'notes/note.html', context)
    

