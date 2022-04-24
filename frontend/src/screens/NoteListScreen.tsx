import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, ListGroup } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

import { StoreState } from '../types/storeTypes';
import { Tag } from '../types/tagTypes';
import { Note, NoteListInfo } from '../types/noteTypes';

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

    const { location, noteListInfo, getAllUserNotes } = props;
    const { loading, errors, noteListDetail } = noteListInfo || {};

    useEffect(() => {
        const pagePattern = /page=(?<page>[0-9]*)/;
        const pageRgx = location.search.match(pagePattern);
        const page = pageRgx && pageRgx.groups ? pageRgx.groups.page : 1;

        getAllUserNotes(page);

    }, [ getAllUserNotes, location.search ]);

    const renderNote = (note: Note): JSX.Element => {
        
        return (
            <Row
                onMouseEnter={e => {
                    e.currentTarget.children[1].children[0].toggleAttribute('hidden')
                    e.currentTarget.children[1].children[1].toggleAttribute('hidden')
                    e.currentTarget.children[2].children[0].toggleAttribute('hidden')
                }}
                onMouseLeave={e => {
                    e.currentTarget.children[1].children[0].toggleAttribute('hidden')
                    e.currentTarget.children[1].children[1].toggleAttribute('hidden')
                    e.currentTarget.children[2].children[0].toggleAttribute('hidden')
                }}
            >   
                <Col md={2} sm={12}>
                    <Link to={`/notes/${note.id}`}>{ note.created.split('T')[0] }</Link>
                </Col>

                <Col md={3} sm={6}>
                    <div>
                        { note.side_a.slice(0, 50) }
                        { note.side_a.length > 50 ? '...' : null }
                    </div>
                    <div hidden>
                        <pre><code>{note.side_a}</code></pre>
                    </div>
                </Col>

                <Col md={3} sm={6}>
                    <div hidden>
                        <pre><code>{note.side_b}</code></pre>
                    </div>
                </Col>

                <Col md={3} sm={12}>
                    {note.tags.map((tag: Tag) => {
                        return (
                            <div 
                                key={tag.name}
                                className='capsule' 
                                style={{ width: 'fit-content' }}
                            >
                                {tag.name}
                            </div>
                        );
                    })}
                </Col>
            </Row>
        );
    };

    const renderNotes = (): JSX.Element | null => {
        if (!noteListDetail) {
            return null;
        }

        return (
            <ListGroup variant='flush'>
                
                <ListGroup.Item style={{ backgroundColor: 'rgb(50, 50, 55)'}}>
                    <Row>
                        <Col md={2} sm={12}><h5>Date</h5></Col>
                        <Col md={3} sm={6}><h5>Side A</h5></Col>
                        <Col md={3} sm={6}><h5>Side B</h5></Col>
                        <Col md={3} sm={12}><h5>Tags</h5></Col>
                    </Row>
                </ListGroup.Item>

                { noteListDetail.noteList.map((note: Note) => {
                    return (<ListGroup.Item key={note.id}>
                        {renderNote(note)}
                    </ListGroup.Item>);
                }) }
            </ListGroup>
        );
    };

    const renderPagination = (): JSX.Element | null => {
        if (!noteListDetail) {
            return null;
        }

        const { page: currentPage, numPages } = noteListDetail;
        const start = Math.max(1, currentPage - 3);
        const end = Math.min(currentPage + 3, numPages);
        const numCapsules = end - start + 1;

        return (
            <div className='d-flex justify-content-center mt-5'>

                { currentPage > 1 
                    ? <span className='capsule'>
                        <Link 
                            to={`/notes/?page=${currentPage - 1}`} 
                            style={{ color: 'white' }}
                        >&lt;</Link>
                    </span>
                    : null
                }                

                { [...Array(numCapsules)].map((v,i) => {
                    return (
                        <span key={i} className='capsule'>   
                            { i + start === currentPage 
                                ? <b>{i + start}</b>
                                : <Link 
                                    to={`/notes/?page=${i+1}`} 
                                    style={{ color: 'white' }}
                                >{i + 1}</Link>
                            }                            
                        </span>
                    );
                }) }

                { currentPage < numPages 
                    ? <span className='capsule'>
                        <Link 
                            to={`/notes/?page=${currentPage + 1}`} 
                            style={{ color: 'white' }}
                        >&gt;</Link>
                    </span>
                    : null
                }   

            </div>
        );
    };

    return (
        <div className='boxed mycard mt-5 p-5'>
            <h3 className='text-center mb-4'>My Notes</h3>

            { loading ? <Loader /> : null }
            { errors ? <Message variant='danger'>{errors}</Message> : null }
            { noteListDetail 
                ? <div>
                    <div>{ renderNotes() }</div>
                    <div>{ renderPagination() }</div>
                </div> 
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