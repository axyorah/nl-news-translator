import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router';

import Loader from '../components/Loader';
import Message from '../components/Message';
import NoteForm from '../components/NoteForm';

import { StoreState } from '../types/storeTypes';
import { NoteSelectInfo, NoteUpdateInfo, NoteDeleteInfo } from '../types/noteTypes';
import { TagListInfo } from '../types/tagTypes';

import { 
    selectUserNote, 
    updateUserNote,
    deleteUserNote,
    resetUpdateUserNote,
    resetDeleteUserNote 
} from '../actions/noteActions';
import { getAllUserTags } from '../actions/tagActions';


interface NoteUpdateScreenState {
    noteSelectInfo: NoteSelectInfo,
    noteUpdateInfo: NoteUpdateInfo,
    noteDeleteInfo: NoteDeleteInfo,
    tagListInfo: TagListInfo
}

interface NoteUpdateScreenDispatch {
    selectUserNote: Function,
    updateUserNote: Function,
    deleteUserNote: Function,
    resetUpdateUserNote: Function,
    resetDeleteUserNote: Function,
    getAllUserTags: Function
}


const NoteUpdateScreen = (
    props: RouteComponentProps & NoteUpdateScreenState & NoteUpdateScreenDispatch
): JSX.Element => {

    const params = useParams<{id: string}>();
    const {
        history,
        noteSelectInfo, noteUpdateInfo, noteDeleteInfo, tagListInfo,
        selectUserNote, updateUserNote, deleteUserNote, 
        resetUpdateUserNote, resetDeleteUserNote,
        getAllUserTags
    } = props;
    const { loading: loadingSelect, errors: errorsSelect, noteSelect } = noteSelectInfo || {};
    const { loading: loadingUpdate, errors: errorsUpdate, noteUpdate } = noteUpdateInfo || {};
    const { loading: loadingDelete, errors: errorsDelete, noteDelete } = noteDeleteInfo || {};
    const { loading: loadingTags, errors: errorsTags, tagList } = tagListInfo || {};    

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

    return (
        <div className='boxed mycard p-5'>
            <h3 className='text-center'>Edit Note</h3>

            { loadingSelect || loadingUpdate || loadingDelete || loadingTags 
                ? <Loader /> 
                : null 
            }
            { errorsSelect || errorsUpdate || errorsDelete || errorsTags
                ? <Message variant='danger'>{
                    errorsSelect || errorsUpdate || errorsDelete || errorsTags
                }</Message> 
                : null
            }

            <NoteForm 
                noteInit={noteSelect} 
                tagList={tagList} 
                updateOrCreateNote={updateUserNote} 
                deleteNote={() => deleteUserNote(params.id)}
            />
            
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {
        noteSelectInfo: state.noteSelectInfo,
        noteUpdateInfo: state.noteUpdateInfo,
        noteDeleteInfo: state.noteDeleteInfo,
        tagListInfo: state.tagListInfo
    };
};

export default connect(
    mapStateToProps,
    { 
        selectUserNote, updateUserNote, deleteUserNote, 
        resetUpdateUserNote, resetDeleteUserNote,
        getAllUserTags 
    }
)(NoteUpdateScreen);