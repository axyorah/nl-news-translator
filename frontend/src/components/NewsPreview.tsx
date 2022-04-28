import React, { useState } from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../types/storeTypes';
import { News } from '../types/newsTypes';

import { selectNewsItem } from '../actions/newsActions';

interface NewsPreviewProps {
    item: News
}

interface NewsPreviewState {}

interface NewsPreviewDispatch {
    selectNewsItem: Function // thunk messes types up :(
}

const NewsPreview = (props: NewsPreviewProps & NewsPreviewState & NewsPreviewDispatch): JSX.Element => {

    const { item, selectNewsItem } = props;
    const { title, source, description } = item;

    const [ hidden, setHidden ] = useState<boolean>(true);

    return (
        <div
            onMouseEnter={e => setHidden(false)}
            onMouseLeave={e => setHidden(true)}
            onClick={e => selectNewsItem(item)}
            >
            <div className="li-title li-between">
                <div hidden={!hidden}>{title.slice(0, 50)}...</div>
                <div hidden= {hidden}>{title}</div>
                <div><span className="capsule">{source.name}</span></div>
            </div>
            <div hidden={hidden} style={{ color: "#a7b5c1", fontSize: "0.8rem" }}>
                {description}
            </div>
        </div>
    );
};

export default connect<NewsPreviewState, NewsPreviewDispatch, {}, StoreState>(
    null,
    { selectNewsItem }
)(NewsPreview);