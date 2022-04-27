import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router';

import Loader from '../components/Loader';
import Message from '../components/Message';
import NoteForm from '../components/NoteForm';

import { StoreState } from '../types/storeTypes';
import { NoteCreateInfo } from '../types/noteTypes';
import { TagListInfo } from '../types/tagTypes';

import {
    createUserNote,
    resetCreateUserNote 
} from '../actions/noteActions';
import { getAllUserTags } from '../actions/tagActions';


interface NoteCreateScreenState {
    noteCreateInfo: NoteCreateInfo,
    tagListInfo: TagListInfo
}

interface NoteCreateScreenDispatch {
    createUserNote: Function,
    resetUserNote: Function,
    getAllUserTags: Function
}


const NoteCreateScreen = (
    props: RouteComponentProps & NoteCreateScreenState & NoteCreateScreenDispatch
): JSX.Element => {

    const params = useParams<{id: string}>();
    const {
        history,
        noteCreateInfo, tagListInfo,
        createUserNote, resetUserNote,
        getAllUserTags
    } = props;
    const { loading: loadingCreate, errors: errorsCreate, noteCreate } = noteCreateInfo || {};
    const { loading: loadingTags, errors: errorsTags, tagList } = tagListInfo || {};    

    // on load
    useEffect(() => {
        getAllUserTags();
    }, [ getAllUserTags, params ]);

    // on successful submit
    useEffect(() => {
        if (noteCreate) {
            resetCreateUserNote();
            history.push('/notes');
        }
    }, [ noteCreate, resetUserNote, history ]);

    return (
        <div className='boxed mycard p-5'>
            <h3 className='text-center'>New Note</h3>

            { loadingCreate || loadingTags ? <Loader /> : null }
            { errorsCreate || errorsTags
                ? <Message variant='danger'>{
                    errorsCreate || errorsTags
                }</Message> 
                : null
            }

            <NoteForm 
                tagList={tagList} 
                updateOrCreateNote={createUserNote} 
            />
            
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {
        noteCreateInfo: state.noteCreateInfo,
        tagListInfo: state.tagListInfo
    };
};

export default connect(
    mapStateToProps,
    { createUserNote, resetCreateUserNote, getAllUserTags }
)(NoteCreateScreen);