import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import Loader from '../components/Loader';
import Message from '../components/Message';
import NoteForm from '../components/NoteForm';
import UserChecker from '../components/UserChecker';

import { StoreState } from '../types/storeTypes';
import { NoteCreateInfo } from '../types/noteTypes';

import {
    createUserNote,
    resetCreateUserNote 
} from '../actions/noteActions';


interface NoteCreateScreenState {
    noteCreateInfo: NoteCreateInfo
}

interface NoteCreateScreenDispatch {
    createUserNote: Function,
    resetCreateUserNote: Function
}


const NoteCreateScreen = (
    props: RouteComponentProps & NoteCreateScreenState & NoteCreateScreenDispatch
): JSX.Element => {

    const {
        history,
        noteCreateInfo, 
        createUserNote, resetCreateUserNote,
    } = props;
    const { loading: loadingCreate, errors: errorsCreate, noteCreate } = noteCreateInfo || {};
    
    // on successful submit
    useEffect(() => {
        if (noteCreate) {
            resetCreateUserNote();
            history.push('/notes');
        }
    }, [ noteCreate, resetCreateUserNote, history ]);
    
    return (
        <div className='boxed mycard p-5'>
            <h3 className='text-center'>New Note</h3>

            <UserChecker />

            { loadingCreate ? <Loader /> : null }
            { errorsCreate 
                ? <Message variant='danger'>{ errorsCreate }</Message> 
                : null
            }

            <NoteForm updateOrCreateNote={createUserNote} />
            
        </div>
    );
};

const mapStateToProps = (state: StoreState): NoteCreateScreenState => {
    return {
        noteCreateInfo: state.noteCreateInfo
    };
};

export default connect<NoteCreateScreenState, NoteCreateScreenDispatch, {}, StoreState>(
    mapStateToProps,
    { createUserNote, resetCreateUserNote }
)(NoteCreateScreen);