from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from django.contrib import messages
from django.core.paginator import Paginator

from notes.models import Note, Tag, Membership
from notes.forms import NoteForm, TagForm

@login_required(login_url='login')
def showNotes(request):
    try:
        profile = request.user.profile
    
        # all notes 
        notes = profile.note_set.order_by('-created')

        # filter notes by tags
        if request.method == 'POST':
            tagNames = [name for name in request.POST if name != 'csrfmiddlewaretoken']
            tags = Tag.objects.filter(owner=profile, name__in=tagNames)
            notes = notes & Note.objects.filter(tags__in=tags)

        # current page notes
        page = request.GET.get('page', 1)
        paginator = Paginator(notes, 5)

        # adjust page number if needed
        if isinstance(page, str) and not page.isnumeric():
            messages.warning(request, 'Page should be a number')
            page = 1
        elif int(page) <= 0:
            messages.warning(request, 'Page number should be above 0')
            page = 1
        elif int(page) > int(paginator.num_pages):
            messages.warning(request, f'Page number {page} is out of range')
            page = paginator.num_pages
    
        context = {
            'notes': paginator.page(page)
        }
    
        return render(request, 'notes/note-list.html', context)

    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')

@login_required(login_url='login')
def getNote(request, pk):
    try:
        profile = request.user.profile
    
        # check if note exists
        if not Note.objects.filter(id=pk):
            messages.error(request, 'Note not found :(')
            return render(request, 'notes/note.html')
        note = Note.objects.get(id=pk)
    
        # check if authorized
        if not profile.note_set.filter(id=pk):
            messages.error(request, 'You are not authorized to see this note')
            return render(request, 'note/note.html')
    
        context = {
            'note': note
        }
    
        return render(request, 'notes/note.html', context)
    
    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')


# Create your views here.
@login_required(login_url='login')
def createNote(request):
    try:
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
                
                messages.success(request, 'Note created successfully!')
                return redirect('note-list')
            else:
                print(noteForm)
                messages.error(request, 'Note creation failed :(')
    
        context = {
            'noteForm': noteForm,
            'tagForm': tagForm
        }
        return render(request, 'notes/note-form.html', context)

    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')

@login_required(login_url='login')
def updateNote(request, pk):
    try:
        profile = request.user.profile
    
        # check if note exists
        if not Note.objects.filter(id=pk):
            messages.error(request, 'Note not found :(')
            return render(request, 'notes/note-list.html', {'notes': profile.note_set.all()})
        
        # check if authorized
        if not profile.note_set.filter(id=pk):
            messages.error(request, 'You are not authorized to view this note')
            return render(request, 'notes/note-list.html', {'notes': profile.note_set.all()})
    
        note = Note.objects.get(id=pk)
        noteForm = NoteForm(instance=note)
        tagForm = TagForm()
    
        # fugly constraint on tags visible for `this` note:
        # this constraint should be added during model creation via `Membership`,
        # but that creates errors for some reason...
        noteForm.fields['tags'].queryset = profile.tag_set.all()
    
        if request.method == 'POST':
            noteForm = NoteForm(request.POST, instance=note)
            if noteForm.is_valid():
                noteForm.save()
                #noteForm.save_m2m() # <-- no longer needed because already commited !!!
    
                #tags = noteForm.cleaned_data.get('tags')
                #print(tags)
                #print(note.tag_set.all())
                messages.success(request, 'Note updated successfully!')
                return redirect('note-list')
            else:
                messages.error(request, 'Note creation failed :(')
    
        context = {
            'noteForm': noteForm,
            'tagForm': tagForm,
            'note': note
        }
    
        return render(request, 'notes/note-form.html', context)

    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')

@login_required(login_url='login')
def deleteNote(request, pk):
    try:
        profile = request.user.profile
    
        # check if note exists
        if not Note.objects.filter(id=pk):
            messages.error(request, 'Note not found :(')
            return render(request, 'notes/note-list.html', {'notes': profile.note_set.all()})
        
        # check if authorized
        if not profile.note_set.filter(id=pk):
            messages.error(request, 'You are not authorized to delete this note')
            return render(request, 'notes/note-list.html', {'notes': profile.note_set.all()})
    
        if request.method == 'DELETE' or request.method == 'POST':
            note = Note.objects.get(id=pk)
            note.delete()
            messages.success(request, 'Note deleted successfully!')
    
        return redirect('note-list')

    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')

@login_required(login_url='login')
def showTags(request):
    try:
        profile = request.user.profile
        form = TagForm()
    
        tags = profile.tag_set.all()
        context = {
            'tags': tags,
            'tagForm': form,
        }
    
        return render(request, 'notes/tag-list.html', context)

    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')

@login_required(login_url='login')
def createTag(request):
    try:
        form = TagForm()
    
        if request.method == 'POST':
            form = TagForm(request.POST)
            if form.is_valid():
                tag = form.save(commit=False)
                tag.owner = request.user.profile
                tag.save()
                messages.success(request, 'Tag was successfully created!')
            else:
                messages.error(request, 'Tag data is not valid')
    
        return redirect('tag-list')

    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')

@login_required(login_url='login')
def updateTag(request, pk):
    try:
        profile = request.user.profile
    
        # check if tag exists
        if not Tag.objects.filter(id=pk):
            messages.error(request, 'Tag not found :(')
            return render(request, 'notes/tag-list.html', {'tags': profile.tag_set.all()})
        
        # check if authorized
        if not profile.tag_set.filter(id=pk):
            messages.error(request, 'You are not authorized to update this tag')
            return render(request, 'notes/tag-list.html', {'tags': profile.tag_set.all()})
    
        tag = Tag.objects.get(id=pk)
        form = TagForm(instance=tag)
    
        if request.method == 'POST':
            form = TagForm(request.POST, instance=tag)
            tag = form.save(commit=False)
            tag.owner = profile
            tag.save()
    
            messages.success(request, 'Tag was successfully updated!')
            return redirect('tag-list')
    
        context = {
            'tag': tag,
            'form': form
        }
        return render(request, 'notes/tag-form.html', context)

    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')

@login_required(login_url='login')
def deleteTag(request, pk):
    try:
        profile = request.user.profile
    
        # check if exists
        if not Tag.objects.filter(id=pk):
            messages.error(request, 'Tag does not exist')
            return redirect('tag-list')
    
        # check if authorized
        if not profile.tag_set.filter(id=pk):
            messages.error(request, 'You are not authorized to delete this tag')
            return redirect('tag-list')
    
        if request.method == 'DELETE' or request.method == 'POST':
            tag = Tag.objects.get(id=pk)
            name = tag.name
            tag.delete()
            messages.success(request, f'Tag `{name}` succesfully deleted')
            
        return redirect('tag-list')

    except Exception as e:
        messages.error(request, e.args[0])
        return redirect('error')
