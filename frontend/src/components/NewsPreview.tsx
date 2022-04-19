import React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../types/storeTypes';
import { News } from '../types/newsTypes';

interface NewsPreviewProps {
    item: News
}

const NewsPreview = (props: NewsPreviewProps) => {

    const { item } = props;
    
    return (
        <div>
            News Preview
            <pre><code>
                {JSON.stringify(item, null, 2)}
            </code></pre>
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