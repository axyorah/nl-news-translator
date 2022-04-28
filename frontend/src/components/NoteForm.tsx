import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Note, NoteMinimal } from '../types/noteTypes';
import { Tag } from '../types/tagTypes';

import TagForm from './TagForm';


interface NoteFormProps {
    noteInit?: Note,
    tagList: Tag[],
    updateOrCreateNote: Function, //update or create action
    deleteNote?: Function // delete action
    createTag?: Function
}

interface TagState {
    [id: string]: boolean
}


const NoteForm = (props: NoteFormProps): JSX.Element => {

    const { 
        noteInit, updateOrCreateNote, deleteNote, 
        tagList, createTag 
    } = props;

    const [ sideA, setSideA ] = useState<string>('');
    const [ sideB, setSideB ] = useState<string>('');
    const [ tags, setTags ] = useState<TagState>({});

    // initialize (if updating)
    useEffect(() => {
        if (noteInit) {
            // set init texts
            setSideA(noteInit.side_a);
            setSideB(noteInit.side_b);
            
            // show all tags, only mark selected note tags as checked
            const tagIds: TagState = {};
            tagList.forEach((tag: Tag) => {
                tagIds[tag.id] = false;
            });
            noteInit.tags.forEach((tag: Tag) => {
                tagIds[tag.id] = true;
            });
            
            setTags(tagIds);
        }        
    }, [ noteInit, tagList ]);


    const renderNoteText = (name: string, val: string, setVal: Function): JSX.Element => {
        return (
            <Col sm={12} md={6} >
                <Form.Group>
                    <Form.Label><h5>{name}</h5></Form.Label>
                    <Form.Control 
                        as='textarea'
                        value={val}
                        onChange={e => {setVal(e.target.value)}}
                        style={{ height: '200px' }}
                    />
                </Form.Group>
            </Col>
        );
    };

    const renderTag = (tag: Tag): JSX.Element => {
        return (
            <Col 
                key={tag.id}
                className='capsule mx-2' 
                style={{ display: 'flex', flexDirection: 'row' }}
            >
                <Form.Check 
                    className='m-0' 
                    checked={tags[tag.id] ? true : false }
                    onChange={e => {
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

    const renderTagForm = (): JSX.Element => {
        return (                
            <Row className='py-3'>
                <Col>
                    { createTag
                        ? <TagForm updateOrCreateTag={createTag} />
                        : null
                    }
            
                    <Link to='/tags' target='_blank' rel='noopener noreferrer'>
                        Add, Change or Delete Tags
                    </Link>
                </Col>
            </Row>
        );
    };

    const renderButtons = (): JSX.Element => {
        return (
            <div className='d-flex justify-content-between'>
                <Button type='submit' variant='secondary' className='mx-3 my-2'>
                    Save
                </Button>

                { deleteNote 
                    ? <Button 
                        type='button' 
                        variant='danger' 
                        className='mx-3 my-2'
                        onClick={e => deleteNote()}
                    >
                        Delete
                    </Button>
                    : null 
                }                
            </div>
        );
    };

    const handleSubmit = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        
        const note: NoteMinimal = {
            side_a: sideA,
            side_b: sideB,
            tags: Object.keys(tags).filter((tagId: string) => tags[tagId])//tagList.filter((tag: Tag) => tags[tag.id])
        };

        if (noteInit) {
            note.id = noteInit.id;
        }

        updateOrCreateNote(note);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                { renderNoteText('Side A', sideA, setSideA)}
                { renderNoteText('Side B', sideB, setSideB)}
            </Row>

            <Row className='boxed m-3 p-3'>
                <h5>Tags</h5>
                { tagList  
                    ? tagList.map((tag: Tag) => renderTag(tag)) 
                    : <small>You have't added any tags yet</small> 
                }
                { renderTagForm() }
            </Row>

            { renderButtons() }
        </Form>
    );
};

export default NoteForm;