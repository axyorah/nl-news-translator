import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router';

import Loader from '../components/Loader';
import Message from '../components/Message';
import NoteForm from '../components/NoteForm';

import { StoreState } from '../types/storeTypes';
import { NoteSelectInfo, NoteUpdateInfo, NoteDeleteInfo } from '../types/noteTypes';

import { 
    selectUserNote, 
    updateUserNote,
    deleteUserNote,
    resetSelectUserNote,
    resetUpdateUserNote,
    resetDeleteUserNote 
} from '../actions/noteActions';


interface NoteUpdateScreenState {
    noteSelectInfo: NoteSelectInfo,
    noteUpdateInfo: NoteUpdateInfo,
    noteDeleteInfo: NoteDeleteInfo
}

interface NoteUpdateScreenDispatch {
    selectUserNote: Function,
    updateUserNote: Function,
    deleteUserNote: Function,
    resetSelectUserNote: Function,
    resetUpdateUserNote: Function,
    resetDeleteUserNote: Function
}


const NoteUpdateScreen = (
    props: RouteComponentProps & NoteUpdateScreenState & NoteUpdateScreenDispatch
): JSX.Element => {

    const params = useParams<{id: string}>();
    const {
        history,
        noteSelectInfo, noteUpdateInfo, noteDeleteInfo,
        selectUserNote, updateUserNote, deleteUserNote, 
        resetUpdateUserNote, resetDeleteUserNote
    } = props;
    const { loading: loadingSelect, errors: errorsSelect, noteSelect } = noteSelectInfo || {};
    const { loading: loadingUpdate, errors: errorsUpdate, noteUpdate } = noteUpdateInfo || {};
    const { loading: loadingDelete, errors: errorsDelete, noteDelete } = noteDeleteInfo || {};
    
    // on load
    useEffect(() => {
        selectUserNote(params.id);
    }, [ selectUserNote, params ]);

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

            { loadingSelect || loadingUpdate || loadingDelete 
                ? <Loader /> 
                : null 
            }
            { errorsSelect || errorsUpdate || errorsDelete 
                ? <Message variant='danger'>{
                    errorsSelect || errorsUpdate || errorsDelete 
                }</Message> 
                : null
            }

            <NoteForm 
                noteInit={noteSelect} 
                updateOrCreateNote={updateUserNote} 
                deleteNote={() => deleteUserNote(params.id)}
            />
            
        </div>
    );
};

const mapStateToProps = (state: StoreState): NoteUpdateScreenState => {
    return {
        noteSelectInfo: state.noteSelectInfo,
        noteUpdateInfo: state.noteUpdateInfo,
        noteDeleteInfo: state.noteDeleteInfo
    };
};

export default connect<NoteUpdateScreenState, NoteUpdateScreenDispatch, {}, StoreState>(
    mapStateToProps,
    { 
        selectUserNote, updateUserNote, deleteUserNote, 
        resetSelectUserNote, resetUpdateUserNote, resetDeleteUserNote
    }
)(NoteUpdateScreen);