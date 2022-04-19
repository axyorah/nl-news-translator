import React, { useState } from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../types/storeTypes';
import { News } from '../types/newsTypes';

interface NewsPreviewProps {
    item: News
}

const NewsPreview = (props: NewsPreviewProps) => {

    const { item } = props;
    const { title, source, description } = item;

    const [ hidden, setHidden ] = useState(true);

    const onPreviewClick = () => {
        console.log(`clicked:\n${JSON.stringify(item, null, 2)}`)
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

const mapStateToProps = (state: StoreState) => {
    return {};
};

export default connect(
    mapStateToProps,
    {}
)(NewsPreview);