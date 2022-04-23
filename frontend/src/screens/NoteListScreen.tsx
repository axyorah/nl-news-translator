import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { StoreState } from '../types/storeTypes';
import { NoteListInfo } from '../types/noteTypes';

import Loader from '../components/Loader';
import Message from '../components/Message';

import { getAllUserNotes } from '../actions/noteActions';


interface NoteListScreenState {
    noteListInfo: NoteListInfo
}

interface NoteListScreenDispatch {
    getAllUserNotes: Function
}


const NoteListScreen = (
    props: RouteComponentProps & NoteListScreenState & NoteListScreenDispatch
): JSX.Element => {

    const { noteListInfo, getAllUserNotes } = props;
    const { loading, errors, noteList } = noteListInfo || {};

    useEffect(() => {
        getAllUserNotes();
    }, [ getAllUserNotes ]);

    const renderNotes = () => {
        return (
        <pre>
            <code>
                {JSON.stringify(noteList, null, 2)}
            </code>
        </pre>
        );
    };

    return (
        <div>
            <h3>My Notes</h3>

            { loading ? <Loader /> : null }
            { errors ? <Message variant='danger'>{errors}</Message> : null }
            { noteList ? renderNotes() : null }

        </div>
    );
};

const mapStateToProps = (state: StoreState): NoteListScreenState => {
    return {
        noteListInfo: state.noteListInfo
    }
};

export default connect<NoteListScreenState, NoteListScreenDispatch, {}, StoreState>(
    mapStateToProps,
    { getAllUserNotes }
)(NoteListScreen);