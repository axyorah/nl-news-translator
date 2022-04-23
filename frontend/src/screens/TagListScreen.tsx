import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { StoreState } from '../types/storeTypes';
import { TagListInfo } from '../types/tagTypes';

import Loader from '../components/Loader';
import Message from '../components/Message';

import { getAllUserTags } from '../actions/tagActions';


interface TagListScreenState {
    tagListInfo: TagListInfo
}

interface TagListScreenDispatch {
    getAllUserTags: Function
}


const TagListScreen = (
    props: RouteComponentProps & TagListScreenState & TagListScreenDispatch
): JSX.Element => {

    const { tagListInfo, getAllUserTags } = props;
    const { loading, errors, tagList } = tagListInfo || {};

    useEffect(() => {
        getAllUserTags();
    }, [ getAllUserTags ]);

    const renderTags = () => {
        return (
        <pre>
            <code>
                {JSON.stringify(tagList, null, 2)}
            </code>
        </pre>
        );
    };

    return (
        <div>
            <h3>My Tags</h3>

            { loading ? <Loader /> : null }
            { errors ? <Message variant='danger'>{errors}</Message> : null }
            { tagList ? renderTags() : null }

        </div>
    );
};

const mapStateToProps = (state: StoreState): TagListScreenState => {
    return {
        tagListInfo: state.tagListInfo
    }
};

export default connect<TagListScreenState, TagListScreenDispatch, {}, StoreState>(
    mapStateToProps,
    { getAllUserTags }
)(TagListScreen);