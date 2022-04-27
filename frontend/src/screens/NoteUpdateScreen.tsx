import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { RouteComponentProps, useParams } from 'react-router';

import Loader from '../components/Loader';
import Message from '../components/Message';

import { StoreState } from '../types/storeTypes';
import { NoteMinimal, NoteSelectInfo, NoteUpdateInfo } from '../types/noteTypes';
import { Tag, TagListInfo } from '../types/tagTypes';

import { 
    selectUserNote, 
    updateUserNote,
    resetUserNote 
} from '../actions/noteActions';
import { getAllUserTags } from '../actions/tagActions';


interface NoteUpdateScreenState {
    noteSelectInfo: NoteSelectInfo,
    noteUpdateInfo: NoteUpdateInfo,
    tagListInfo: TagListInfo
}

interface NoteUpdateScreenDispatch {
    selectUserNote: Function,
    updateUserNote: Function,
    resetUserNote: Function,
    getAllUserTags: Function
}

interface TagState {
    [id: string]: boolean
}


const NoteUpdateScreen = (
    props: RouteComponentProps & NoteUpdateScreenState & NoteUpdateScreenDispatch
): JSX.Element => {

    const params = useParams<{id: string}>();
    const {
        history,
        noteSelectInfo, noteUpdateInfo, tagListInfo,
        selectUserNote, updateUserNote, resetUserNote,
        getAllUserTags
    } = props;
    const { loading: loadingSelect, errors: errorsSelect, noteSelect } = noteSelectInfo || {};
    const { loading: loadingUpdate, errors: errorsUpdate, noteUpdate } = noteUpdateInfo || {};
    const { loading: loadingTags, errors: errorsTags, tagList } = tagListInfo || {};    

    const [ sideA, setSideA ] = useState('');
    const [ sideB, setSideB ] = useState('');
    const [ tags, setTags ] = useState<TagState>({});


    // on load
    useEffect(() => {
        selectUserNote(params.id);
        getAllUserTags();
    }, [ selectUserNote, getAllUserTags, params ]);

    // initialize
    useEffect(() => {
        // set init texts
        setSideA(noteSelect.side_a);
        setSideB(noteSelect.side_b);

        // show all tags, only mark selected note tags as checked
        const tagIds: TagState = {};
        tagList.forEach((tag: Tag) => {
            tagIds[tag.id] = false;
        });
        noteSelect.tags.forEach((tag: Tag) => {
            tagIds[tag.id] = true;
        });

        setTags(tagIds);
    }, [ noteSelect, tagList ]);

    // on successful submit
    useEffect(() => {
        if (noteUpdate) {
            resetUserNote();
            history.push('/notes');
        }
    }, [ noteUpdate, resetUserNote, history ]);


    const renderNoteText = (name: string, val: string, setVal: Function): JSX.Element => {
        return (
            <Col sm={12} md={6} >
                <Form.Group>
                    <Form.Label>{name}</Form.Label>
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

    const renderTag = (tag: Tag) => {
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

    const submitHandler = (e: React.SyntheticEvent) => {
        e.preventDefault();
        
        const note: NoteMinimal = {
            id: params.id,
            side_a: sideA,
            side_b: sideB,
            tags: Object.keys(tags).filter((tagId: string) => tags[tagId])//tagList.filter((tag: Tag) => tags[tag.id])
        };

        updateUserNote(note);
    };

    return (
        <div className='boxed mycard p-5'>
            <h3 className='text-center'>Edit Note</h3>

            { loadingSelect || loadingUpdate || loadingTags 
                ? <Loader /> 
                : null 
            }
            { errorsSelect || errorsUpdate || errorsTags
                ? <Message variant='danger'>{
                    errorsSelect || errorsUpdate || errorsTags
                }</Message> 
                : null
            }

            <Form onSubmit={submitHandler}>
                <Row>
                    { renderNoteText('Side A', sideA, setSideA)}
                    { renderNoteText('Side B', sideB, setSideB)}
                </Row>
                <Row>
                    { tagList && noteSelect 
                        ? tagList.map((tag: Tag) => renderTag(tag)) 
                        : null 
                    }
                </Row>

                <Button type='submit' className='mx-3 my-2'>
                    Update Note
                </Button>
            </Form>
            
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {
        noteSelectInfo: state.noteSelectInfo,
        noteUpdateInfo: state.noteUpdateInfo,
        tagListInfo: state.tagListInfo
    };
};

export default connect(
    mapStateToProps,
    { selectUserNote, updateUserNote, resetUserNote, getAllUserTags }
)(NoteUpdateScreen);