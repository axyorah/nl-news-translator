import React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../types/storeTypes';
import { NewsListInfo } from '../types/newsTypes';

interface NewsListProps {
    newsListInfo: NewsListInfo
}

const NewsList = (props: NewsListProps) => {
    const { newsListInfo } = props;
    const { loading, errors, newsList } = newsListInfo;

    return (
        <div className="boxed mycard p-5">
            <h3 className="text-center">News Overview</h3>
            { errors ? `Error: ${errors}` : null }
            { loading ? 'Loading...' : null }
            { 
                newsList && newsList.length  
                ? <pre><code>{JSON.stringify(newsList, null, 2)}</code></pre>
                : null
            }            
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {
        newsListInfo: state.newsListInfo
    };
};

export default connect(
    mapStateToProps,
    {}
)(NewsList);