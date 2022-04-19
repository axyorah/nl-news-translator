import React, { useState } from 'react';
import { connect } from 'react-redux';

import { News } from '../types/newsTypes';

import { selectNewsItem } from '../actions/newsActions';

interface NewsPreviewProps {
    item: News,
    selectNewsItem: Function // thunk messes types up :(
}

const NewsPreview = (props: NewsPreviewProps): JSX.Element => {

    const { item, selectNewsItem } = props;
    const { title, source, description } = item;

    const [ hidden, setHidden ] = useState(true);

    const onPreviewClick = () => {
        console.log(`clicked:\n${JSON.stringify(item, null, 2)}`);
        selectNewsItem(item);
    };

    return (
        <div
            onMouseEnter={e => setHidden(false)}
            onMouseLeave={e => setHidden(true)}
            onClick={onPreviewClick}
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

export default connect(
    null,
    { selectNewsItem }
)(NewsPreview);