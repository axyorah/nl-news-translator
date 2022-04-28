import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { StoreState } from '../types/storeTypes';
import { Tag, TagListInfo } from '../types/tagTypes';
import { NoteListInfo } from '../types/noteTypes';

import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginator from '../components/Paginator';
import NoteList from '../components/NoteList';

import { getAllUserNotes } from '../actions/noteActions';
import { getAllUserTags } from '../actions/tagActions';


interface NoteListScreenState {
    noteListInfo: NoteListInfo,
    tagListInfo: TagListInfo
}

interface NoteListScreenDispatch {
    getAllUserNotes: Function,
    getAllUserTags: Function
}

interface TagState {
    [tagId: string]: boolean
}


const NoteListScreen = (
    props: RouteComponentProps & NoteListScreenState & NoteListScreenDispatch
): JSX.Element => {

    const { 
        location, history,
        noteListInfo, tagListInfo,
        getAllUserNotes, getAllUserTags 
    } = props;

    const { loading: loadingNotes, errors: errorsNotes, noteListDetail } = noteListInfo || {};
    const { noteList, page, numPages } = noteListDetail || {};

    const { loading: loadingTags, errors: errorsTags, tagList } = tagListInfo || {};    

    const [ tags, setTags ] = useState<TagState>({});

    // on load
    useEffect(() => {
        // reset url
        history.push('/notes/')

        // load all (unfiltered)
        getAllUserNotes();
        getAllUserTags();
    }, [ getAllUserNotes, getAllUserTags, history ])

    // on `page` or `tags` change
    useEffect(() => {
        // get actual page from query string
        const pagePattern = /page=(?<page>[0-9]*)/;
        const pageRgx = location.search.match(pagePattern);
        const page = pageRgx && pageRgx.groups ? pageRgx.groups.page : 1;

        // get tagIds
        const tagIds = Object.keys(tags).filter(
            (tagId: string) => tags[tagId]
        );

        // update noteList
        getAllUserNotes(page, tagIds);

    }, [ getAllUserNotes, getAllUserTags, location.search, tags ]);


    const renderTag = (tag: Tag): JSX.Element => {
        return (
            <Col 
                key={tag.id}
                className='capsule' 
                style={{ display: 'flex', flexDirection: 'row' }}                                
            >
                <Form.Check 
                    className='m-0' 
                    onClick={e => {
                        e.currentTarget.checked = tags[tag.id] ? false : true;
                        setTags({
                            ...tags,
                            [tag.id]: tags[tag.id] ? false : true 
                        });
                    }}
                />
                <Form.Label className='m-0' >{tag.name}</Form.Label>
            </Col>
        );
    };

    const renderTags = (): JSX.Element => {
        return (
            <div className='m-3'>
                <Row> { tagList.map((tag: Tag) => renderTag(tag)) }</Row>
            </div>
        );
    };

    return (
        <div className='boxed mycard mt-5 p-5'>

            <h3 className='text-center mb-4'>My Notes</h3>

            { loadingTags ? <Loader /> : null }
            { errorsTags ? <Message variant='danger'>{errorsTags}</Message> : null }

            { tagList ? renderTags() : null }

            { loadingNotes ? <Loader /> : null }
            { errorsNotes ? <Message variant='danger'>{errorsNotes}</Message> : null }

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
        noteListInfo: state.noteListInfo,
        tagListInfo: state.tagListInfo
    }
};

export default connect<NoteListScreenState, NoteListScreenDispatch, {}, StoreState>(
    mapStateToProps,
    { getAllUserNotes, getAllUserTags }
)(NoteListScreen);