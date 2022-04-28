import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router';

import Loader from '../components/Loader';
import Message from '../components/Message';
import NoteForm from '../components/NoteForm';

import { StoreState } from '../types/storeTypes';
import { NoteSelectInfo, NoteUpdateInfo, NoteDeleteInfo } from '../types/noteTypes';
import { TagListInfo, TagCreateInfo } from '../types/tagTypes';

import { 
    selectUserNote, 
    updateUserNote,
    deleteUserNote,
    resetSelectUserNote,
    resetUpdateUserNote,
    resetDeleteUserNote 
} from '../actions/noteActions';
import { 
    getAllUserTags,
    createUserTag,
    resetCreateUserTag 
} from '../actions/tagActions';


interface NoteUpdateScreenState {
    noteSelectInfo: NoteSelectInfo,
    noteUpdateInfo: NoteUpdateInfo,
    noteDeleteInfo: NoteDeleteInfo,
    tagListInfo: TagListInfo,
    tagCreateInfo: TagCreateInfo
}

interface NoteUpdateScreenDispatch {
    selectUserNote: Function,
    updateUserNote: Function,
    deleteUserNote: Function,
    resetSelectUserNote: Function,
    resetUpdateUserNote: Function,
    resetDeleteUserNote: Function,
    getAllUserTags: Function,
    createUserTag: Function,
    resetCreateUserTag: Function
}


const NoteUpdateScreen = (
    props: RouteComponentProps & NoteUpdateScreenState & NoteUpdateScreenDispatch
): JSX.Element => {

    const params = useParams<{id: string}>();
    const {
        history,
        noteSelectInfo, noteUpdateInfo, noteDeleteInfo, 
        tagListInfo, tagCreateInfo,
        selectUserNote, updateUserNote, deleteUserNote, 
        resetUpdateUserNote, resetDeleteUserNote,
        getAllUserTags, createUserTag, resetCreateUserTag
    } = props;
    const { loading: loadingSelect, errors: errorsSelect, noteSelect } = noteSelectInfo || {};
    const { loading: loadingUpdate, errors: errorsUpdate, noteUpdate } = noteUpdateInfo || {};
    const { loading: loadingDelete, errors: errorsDelete, noteDelete } = noteDeleteInfo || {};
    const { loading: loadingTags, errors: errorsTags, tagList } = tagListInfo || {};
    const { loading: loadingCreateTag, errors: errorsCreateTag, tagCreate } = tagCreateInfo || {};

    // on load
    useEffect(() => {
        selectUserNote(params.id);
        getAllUserTags();
    }, [ selectUserNote, getAllUserTags, params ]);

    // on successful submit
    useEffect(() => {
        if (noteUpdate) {
            resetUpdateUserNote();
            history.push('/notes');
        }
    }, [ noteUpdate, resetUpdateUserNote, history ]);

    // on successful delete
    useEffect(() => {
        if (noteDelete) {
            resetDeleteUserNote();
            history.push('/notes');
        }
    }, [ noteDelete, resetDeleteUserNote, history]);

    // on successful tag create
    useEffect(() => {
        if (tagCreate) {
            resetCreateUserTag();
            getAllUserTags();
        }
    }, [ tagCreate, resetCreateUserTag, getAllUserTags ]);

    return (
        <div className='boxed mycard p-5'>
            <h3 className='text-center'>Edit Note</h3>

            { loadingSelect || loadingUpdate || loadingDelete || 
              loadingTags || loadingCreateTag
                ? <Loader /> 
                : null 
            }
            { errorsSelect || errorsUpdate || errorsDelete || 
              errorsTags || errorsCreateTag
                ? <Message variant='danger'>{
                    errorsSelect || errorsUpdate || errorsDelete || 
                    errorsTags || errorsCreateTag
                }</Message> 
                : null
            }

            <NoteForm 
                noteInit={noteSelect} 
                tagList={tagList} 
                updateOrCreateNote={updateUserNote} 
                deleteNote={() => deleteUserNote(params.id)}
                createTag={createUserTag}
            />
            
        </div>
    );
};

const mapStateToProps = (state: StoreState): NoteUpdateScreenState => {
    return {
        noteSelectInfo: state.noteSelectInfo,
        noteUpdateInfo: state.noteUpdateInfo,
        noteDeleteInfo: state.noteDeleteInfo,
        tagListInfo: state.tagListInfo,
        tagCreateInfo: state.tagCreateInfo
    };
};

export default connect<NoteUpdateScreenState, NoteUpdateScreenDispatch, {}, StoreState>(
    mapStateToProps,
    { 
        selectUserNote, updateUserNote, deleteUserNote, 
        resetSelectUserNote, resetUpdateUserNote, resetDeleteUserNote,
        getAllUserTags, createUserTag, resetCreateUserTag 
    }
)(NoteUpdateScreen);