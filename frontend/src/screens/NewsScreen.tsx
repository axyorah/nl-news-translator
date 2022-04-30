import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import NewsList from '../components/NewsList';
import NewsSelected from '../components/NewsSelected';
import NoteForm from '../components/NoteForm';

import { StoreState } from '../types/storeTypes';
import { NewsSelectInfo, NewsTranslateInfo } from '../types/newsTypes';
import { NoteCreateInfo } from '../types/noteTypes';
import { TagListInfo } from '../types/tagTypes';

import { translateNewsItem } from '../actions/newsActions';
import { createUserNote, resetCreateUserNote } from '../actions/noteActions';
import { getAllUserTags } from '../actions/tagActions';
import Message from '../components/Message';

interface NewsScreenState {
    newsSelectInfo: NewsSelectInfo,
    newsTranslateInto: NewsTranslateInfo,
    noteCreateInfo: NoteCreateInfo,
    tagListInfo: TagListInfo
};
interface NewsScreenDispatch {
    translateNewsItem: Function,
    createUserNote: Function,
    resetCreateUserNote: Function,
    getAllUserTags: Function
};

const NewsScreen = (
    props: RouteComponentProps & NewsScreenState & NewsScreenDispatch
): JSX.Element => {

    const { 
        newsSelectInfo, newsTranslateInto, noteCreateInfo, tagListInfo,
        translateNewsItem, createUserNote, resetCreateUserNote, getAllUserTags
    } = props;
    const { newsSelected } = newsSelectInfo || {};
    const { loading: loadingTranslate } = newsTranslateInto || {};
    const { loading: loadingNoteCreate, errors: errorsNoteCreate, noteCreate } = noteCreateInfo || {};
    const { sentences } = newsSelected || {};
    const { tagList } = tagListInfo || {};

    const [ hidePopup, setHidePopup ] = useState<boolean>(true);

    // on load
    useEffect(() => {
        getAllUserTags();
    }, [ getAllUserTags ]);

    // on successful note create via popup
    useEffect(() => {
        if (noteCreate) {
            resetCreateUserNote();
            setHidePopup(true);
        }
    }, [ noteCreate, resetCreateUserNote, setHidePopup ]);

    const renderButtons = (): JSX.Element => {
        return (
            <div 
                className="d-flex justify-content-between px-5"
                id="note-btn-container"
            >
                <div>
                    { sentences && sentences.length
                        ? <button 
                            className="capsule-lg"
                            style={{ display: 'flex', flexDirection: 'row' }}
                            onClick={e => translateNewsItem(newsSelected)} 
                        >
                            { loadingTranslate ? <Loader size="23px"/> : null }
                            <span>&nbsp;Translate</span>
                        </button>
                        : null
                    }
                </div>
                <div>
                    <Button 
                        className='capsule-lg'
                        onClick={e => setHidePopup(!hidePopup)}
                    >
                        Add Note
                    </Button>
                </div>
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
                    <NoteForm tagList={tagList} updateOrCreateNote={createUserNote}/>
                </Modal.Body>
            </Modal>
        );
    };

    return (
        <div>

            { loadingNoteCreate ? <Loader /> : null }

            { errorsNoteCreate 
                ? <Message variant='danger'>{errorsNoteCreate}</Message>
                : null
            }

            <Row className="my-3">
                <Col>
                    <SearchBar />
                </Col>
            </Row>

            <Row className="my-3">
                <Col lg={5} xl={4}>
                    <NewsList /> 
                </Col>
                <Col lg={7} xl={8}>
                    <NewsSelected areButtonsRendered={false} />
                    { renderButtons() }
                </Col>
            </Row>

            { renderPopup() }
            
        </div>
    );
};

const mapStateToProps = (state: StoreState): NewsScreenState => {
    return {
        newsSelectInfo: state.newsSelectInfo,
        newsTranslateInto: state.newsTranslateInfo,
        noteCreateInfo: state.noteCreateInfo,
        tagListInfo: state.tagListInfo
    };
};

export default connect<NewsScreenState, NewsScreenDispatch, {}, StoreState>(
    mapStateToProps,
    { 
        translateNewsItem, 
        createUserNote, resetCreateUserNote, 
        getAllUserTags 
    }
)(NewsScreen);