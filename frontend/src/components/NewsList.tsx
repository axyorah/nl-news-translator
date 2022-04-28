import React from 'react';
import { connect } from 'react-redux';
import { ListGroup } from 'react-bootstrap';

import Loader from './Loader';
import Message from './Message';
import NewsPreview from './NewsPreview';

import { StoreState } from '../types/storeTypes';
import { News, NewsListInfo } from '../types/newsTypes';

interface NewsListState {
    newsListInfo: NewsListInfo
}

interface NewsListDispatch {}

const NewsList = (props: NewsListState & NewsListDispatch): JSX.Element => {
    
    const { newsListInfo } = props;
    const { loading, errors, newsList } = newsListInfo;

    const renderList = (): JSX.Element => {
        return (
            <ListGroup variant="flush">
                {newsList.map((newsItem: News, i: number) => {
                    return (
                        <ListGroup.Item key={i.toString()}>
                            <NewsPreview item={newsItem} />
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        );
    };

    return (
        <div className="boxed mycard p-5">
            <h3 className="text-center">News Overview</h3>
            { errors ? <Message variant='danger'>{errors}</Message> : null }
            { loading ? <Loader /> : null }
            { 
                newsList && newsList.length  
                ? renderList()
                : null
            }
        </div>
    );
};

const mapStateToProps = (state: StoreState): NewsListState => {
    return {
        newsListInfo: state.newsListInfo
    };
};

export default connect<NewsListState, NewsListDispatch, {}, StoreState>(
    mapStateToProps,
    {}
)(NewsList);