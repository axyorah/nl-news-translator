import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { StoreState } from '../types/storeTypes';
import { NoteListInfo } from '../types/noteTypes';

import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginator from '../components/Paginator';
import NoteList from '../components/NoteList';

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

    const { location, noteListInfo, getAllUserNotes } = props;
    const { loading, errors, noteListDetail } = noteListInfo || {};
    const { noteList, page, numPages } = noteListDetail || {};

    useEffect(() => {
        const pagePattern = /page=(?<page>[0-9]*)/;
        const pageRgx = location.search.match(pagePattern);
        const page = pageRgx && pageRgx.groups ? pageRgx.groups.page : 1;

        getAllUserNotes(page);

    }, [ getAllUserNotes, location.search ]);

    return (
        <div className='boxed mycard mt-5 p-5'>

            <h3 className='text-center mb-4'>My Notes</h3>

            { loading ? <Loader /> : null }
            { errors ? <Message variant='danger'>{errors}</Message> : null }
            { noteListDetail
                ? (<div>
                    <NoteList noteList={noteList} />
                    <Paginator 
                        baseURL='/notes/' 
                        params={{page: page}} 
                        page={page} 
                        numPages={numPages}
                    />
                </div>)
                : null
            }

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