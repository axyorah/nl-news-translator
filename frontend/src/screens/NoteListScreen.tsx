import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Modal, Button } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { StoreState } from '../types/storeTypes';
import { Tag, TagListInfo } from '../types/tagTypes';
import { NoteListInfo, NoteCreateInfo } from '../types/noteTypes';

import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginator from '../components/Paginator';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';

import { getAllUserNotes, createUserNote, resetCreateUserNote } from '../actions/noteActions';
import { getAllUserTags } from '../actions/tagActions';


interface NoteListScreenState {
    noteListInfo: NoteListInfo,
    noteCreateInfo: NoteCreateInfo,
    tagListInfo: TagListInfo
}

interface NoteListScreenDispatch {
    getAllUserNotes: Function,
    createUserNote: Function,
    resetCreateUserNote: Function,
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
        noteListInfo, noteCreateInfo, tagListInfo,
        getAllUserNotes, createUserNote, resetCreateUserNote, 
        getAllUserTags 
    } = props;

    const { loading: loadingNotes, errors: errorsNotes, noteListDetail } = noteListInfo || {};
    const { noteList, page, numPages } = noteListDetail || {};

    const { loading: loadingNoteCreate, errors: errorsNoteCreate, noteCreate } = noteCreateInfo || {};
    const { loading: loadingTags, errors: errorsTags, tagList } = tagListInfo || {};    

    const [ tags, setTags ] = useState<TagState>({});
    const [ hidePopup, setHidePopup ] = useState<boolean>(true);

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

    // on successful note create
    useEffect(() => {
        if (noteCreate) {
            resetCreateUserNote();
            setHidePopup(true);
        }
    }, [ noteCreate, resetCreateUserNote ]);


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

    const renderButtons = (): JSX.Element => {
        return (
            <div className='w-100 d-flex justify-content-end'>
                <Button 
                    className='capsule-lg'
                    onClick={e => setHidePopup(!hidePopup)}
                >
                    Add Note
                </Button>
            </div>
        );
    };

    const renderPopup = () => {
        return (
            <Modal
                size='lg'
                show={!hidePopup}
                onHide={() => setHidePopup(true)}
            >
                <Modal.Header closeButton className='mycard'>
                    <h3 className='px-3'>Add New Note</h3>
                </Modal.Header>
                <Modal.Body className='mycard'>
                    <NoteForm updateOrCreateNote={createUserNote} />
                </Modal.Body>
            </Modal>
        );
    };

    return (
        <div className='boxed mycard mt-5 p-5'>

            <h3 className='text-center mb-4'>My Notes</h3>

            { loadingTags || loadingNoteCreate ? <Loader /> : null }
            { errorsTags || errorsNoteCreate 
                ? <Message variant='danger'>
                    { errorsTags || errorsNoteCreate }
                </Message> 
                : null 
            }

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

            { renderButtons() }

            { renderPopup() }

        </div>
    );
};

const mapStateToProps = (state: StoreState): NoteListScreenState => {
    return {
        noteListInfo: state.noteListInfo,
        noteCreateInfo: state.noteCreateInfo,
        tagListInfo: state.tagListInfo
    }
};

export default connect<NoteListScreenState, NoteListScreenDispatch, {}, StoreState>(
    mapStateToProps,
    { getAllUserNotes, createUserNote, resetCreateUserNote, getAllUserTags }
)(NoteListScreen);