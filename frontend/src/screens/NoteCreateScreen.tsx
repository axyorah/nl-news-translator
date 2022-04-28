import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router';

import Loader from '../components/Loader';
import Message from '../components/Message';
import NoteForm from '../components/NoteForm';

import { StoreState } from '../types/storeTypes';
import { NoteCreateInfo } from '../types/noteTypes';
import { TagListInfo, TagCreateInfo } from '../types/tagTypes';

import {
    createUserNote,
    resetCreateUserNote 
} from '../actions/noteActions';
import { 
    getAllUserTags,
    createUserTag,
    resetCreateUserTag 
} from '../actions/tagActions';


interface NoteCreateScreenState {
    noteCreateInfo: NoteCreateInfo,
    tagListInfo: TagListInfo,
    tagCreateInfo: TagCreateInfo
}

interface NoteCreateScreenDispatch {
    createUserNote: Function,
    resetCreateUserNote: Function,
    getAllUserTags: Function,
    createUserTag: Function,
    resetCreateUserTag: Function
}


const NoteCreateScreen = (
    props: RouteComponentProps & NoteCreateScreenState & NoteCreateScreenDispatch
): JSX.Element => {

    const params = useParams<{id: string}>();
    const {
        history,
        noteCreateInfo, tagListInfo, tagCreateInfo,
        createUserNote, resetCreateUserNote,
        getAllUserTags, createUserTag, 
        resetCreateUserTag
    } = props;
    const { loading: loadingCreate, errors: errorsCreate, noteCreate } = noteCreateInfo || {};
    const { loading: loadingTags, errors: errorsTags, tagList } = tagListInfo || {}; 
    const { loading: loadingCreateTag, errors: errorsCreateTag, tagCreate } = tagCreateInfo || {};

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
    }, [ noteCreate, resetCreateUserNote, history ]);

    // on successful tag creation
    useEffect(() => {
        if (tagCreate) {
            resetCreateUserTag();
            getAllUserTags();
        }
    }, [ tagCreate, resetCreateUserTag, getAllUserTags ]);

    return (
        <div className='boxed mycard p-5'>
            <h3 className='text-center'>New Note</h3>

            { loadingCreate || loadingTags || loadingCreateTag ? <Loader /> : null }
            { errorsCreate || errorsTags || errorsCreateTag
                ? <Message variant='danger'>{
                    errorsCreate || errorsTags || errorsCreateTag
                }</Message> 
                : null
            }

            <NoteForm 
                tagList={tagList} 
                updateOrCreateNote={createUserNote}
                createTag={createUserTag} 
            />
            
        </div>
    );
};

const mapStateToProps = (state: StoreState): NoteCreateScreenState => {
    return {
        noteCreateInfo: state.noteCreateInfo,
        tagListInfo: state.tagListInfo,
        tagCreateInfo: state.tagCreateInfo
    };
};

export default connect<NoteCreateScreenState, NoteCreateScreenDispatch, {}, StoreState>(
    mapStateToProps,
    { 
        createUserNote, resetCreateUserNote, 
        getAllUserTags, createUserTag, resetCreateUserTag 
    }
)(NoteCreateScreen);