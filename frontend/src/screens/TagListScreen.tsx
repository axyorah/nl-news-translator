import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { StoreState } from '../types/storeTypes';
import { 
    Tag,
    TagListInfo, 
    TagSelectInfo,
    TagCreateInfo, 
    TagUpdateInfo, 
    TagDeleteInfo 
} from '../types/tagTypes';

import Loader from '../components/Loader';
import Message from '../components/Message';
import TagForm from '../components/TagForm';

import { 
    getAllUserTags, 
    selectUserTag, 
    resetSelectUserTag,
    createUserTag, 
    resetCreateUserTag,
    updateUserTag,
    resetUpdateUserTag,
    deleteUserTag,
    resetDeleteUserTag 
} from '../actions/tagActions';


interface TagListScreenState {
    tagListInfo: TagListInfo,
    tagSelectInfo: TagSelectInfo,
    tagCreateInfo: TagCreateInfo,
    tagUpdateInfo: TagUpdateInfo,
    tagDeleteInfo: TagDeleteInfo
}

interface TagListScreenDispatch {
    getAllUserTags: Function,
    selectUserTag: Function,
    resetSelectUserTag: Function,
    createUserTag: Function,
    resetCreateUserTag: Function,
    updateUserTag: Function,
    resetUpdateUserTag: Function,
    deleteUserTag: Function,
    resetDeleteUserTag: Function
}


const TagListScreen = (
    props: RouteComponentProps & TagListScreenState & TagListScreenDispatch
): JSX.Element => {

    const { 
        tagListInfo, tagSelectInfo, tagCreateInfo, tagUpdateInfo, tagDeleteInfo,
        getAllUserTags, selectUserTag, createUserTag, updateUserTag, deleteUserTag,
        resetSelectUserTag, resetCreateUserTag, resetUpdateUserTag, resetDeleteUserTag
    } = props;

    const { loading: loadingList, errors: errorsList, tagList } = tagListInfo || {};
    const { loading: loadingSelect, errors: errorsSelect, tagSelect } = tagSelectInfo || {};
    const { loading: loadingCreate, errors: errorsCreate, tagCreate } = tagCreateInfo || {};
    const { loading: loadingUpdate, errors: errorsUpdate, tagUpdate } = tagUpdateInfo || {};
    const { loading: loadingDelete, errors: errorsDelete, tagDelete } = tagDeleteInfo || {};

    // on load
    useEffect(() => {
        getAllUserTags();
    }, [ getAllUserTags ]);

    // on successful create
    useEffect(() => {
        if (tagCreate) {
            resetCreateUserTag();
            getAllUserTags();
        }
    }, [ tagCreate, resetCreateUserTag, getAllUserTags ]);

    // on successfull update
    useEffect(() => {
        if (tagUpdate) {
            resetUpdateUserTag();
            resetSelectUserTag();
            getAllUserTags();
        }
    }, [ tagUpdate, resetSelectUserTag, resetUpdateUserTag, getAllUserTags ]);

    // on successfull delete
    useEffect(() => {
        if (tagDelete) {
            resetDeleteUserTag();
            resetSelectUserTag();
            getAllUserTags();
        }
    }, [ tagDelete, resetSelectUserTag, resetDeleteUserTag, getAllUserTags ]);


    const renderTags = (): JSX.Element => {
        return (
            <Row className='my-3'>
                { tagList.map((tag: Tag) => {
                    return (
                        <Col 
                            className='capsule'
                            onClick={e => selectUserTag(tag.id)}
                        >{tag.name}</Col>
                    );
                }) }
            </Row>
        );
    };

    const renderTagForms = (): JSX.Element => {
        return (
            <Row className='my-3'>
                <Col md={6} className='boxed p-4'>
                    <h4>Edit Tag</h4>

                    { tagSelect && tagSelect.id
                        ? <TagForm 
                            tagSelect={tagSelect}
                            updateOrCreateTag={updateUserTag}
                            deleteTag={() => deleteUserTag(tagSelect.id)}
                        /> 
                        : <small className='text-muted'>
                            Click on tag to edit
                        </small>
                    }
                </Col>
                <Col md={6} className='boxed p-4'>
                    <h4>Add New Tag</h4>
                    <TagForm updateOrCreateTag={createUserTag} />
                </Col>
            </Row>
        );
    };

    return (
        <div className='boxed mycard p-5 my-5'>
            <h3 className='text-center'>My Tags</h3>
            
            { errorsList || errorsSelect || errorsUpdate || errorsCreate || errorsDelete
                ? <Message variant='danger'>
                    { errorsList || errorsSelect || errorsUpdate || errorsCreate || errorsDelete }
                </Message> 
                : null 
            }

            { tagList ? renderTags() : null }

            { renderTagForms() }

            { loadingList || loadingSelect || loadingUpdate || loadingCreate || loadingDelete 
                ? <Loader /> 
                : null 
            }

        </div>
    );
};

const mapStateToProps = (state: StoreState): TagListScreenState => {
    return {
        tagListInfo: state.tagListInfo,
        tagSelectInfo: state.tagSelectInfo,
        tagCreateInfo: state.tagCreateInfo,
        tagUpdateInfo: state.tagUpdateInfo,
        tagDeleteInfo: state.tagDeleteInfo
    }
};

export default connect<TagListScreenState, TagListScreenDispatch, {}, StoreState>(
    mapStateToProps,
    { 
        getAllUserTags, 
        selectUserTag, createUserTag, updateUserTag, deleteUserTag,
        resetSelectUserTag, resetCreateUserTag, resetUpdateUserTag, resetDeleteUserTag 
    }
)(TagListScreen);