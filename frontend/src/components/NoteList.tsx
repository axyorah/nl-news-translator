import React from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Note } from '../types/noteTypes';
import { Tag } from '../types/tagTypes';


interface NoteListProps {
    noteList: Note[]
}

const NoteList = (props: NoteListProps): JSX.Element => {

    const { noteList } = props;
 
    const renderNoteHeader = (): JSX.Element => {
        return (
            <ListGroup.Item style={{ backgroundColor: 'rgb(50, 50, 55)'}}>
                <Row>
                    <Col md={2} sm={12}><h5>Date</h5></Col>
                    <Col md={3} sm={6}><h5>Side A</h5></Col>
                    <Col md={3} sm={6}><h5>Side B</h5></Col>
                    <Col md={4} sm={12}><h5>Tags</h5></Col>
                </Row>
            </ListGroup.Item>
        );
    };

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
                <Col md={2} sm={12} className='note-created'>
                    <Link to={`/notes/${note.id}/edit`}>{ note.created.split('T')[0] }</Link>
                </Col>
    
                <Col md={3} sm={6} className='note-side-a'>
                    <div>
                        { note.side_a.slice(0, 50) }
                        { note.side_a.length > 50 ? '...' : null }
                    </div>
                    <div hidden style={{ whiteSpace: 'pre-wrap' }}>
                        {note.side_a}
                    </div>
                </Col>
    
                <Col md={3} sm={6} className='note-side-b'>
                    <div hidden style={{ whiteSpace: 'pre-wrap' }}>
                        {note.side_b}
                    </div>
                </Col>
    
                <Col md={4} sm={12} className='note-tags'>
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

    return (
        <ListGroup variant='flush'>
            { renderNoteHeader()}
            { noteList.map((note: Note) => {
                return (<ListGroup.Item key={note.id}>
                    { renderNote(note) }
                </ListGroup.Item>);
            }) }
        </ListGroup>
    );
};

export default NoteList;