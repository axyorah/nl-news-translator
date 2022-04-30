import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import NewsList from '../components/NewsList';
import NewsSelected from '../components/NewsSelected';

import { StoreState } from '../types/storeTypes';
import { NewsSelectInfo, NewsTranslateInfo } from '../types/newsTypes';
import { translateNewsItem } from '../actions/newsActions';

interface NewsScreenState {
    newsSelectInfo: NewsSelectInfo,
    newsTranslateInto: NewsTranslateInfo
};
interface NewsScreenDispatch {
    translateNewsItem: Function
};

const NewsScreen = (
    props: RouteComponentProps & NewsScreenState & NewsScreenDispatch
): JSX.Element => {

    const { newsSelectInfo, newsTranslateInto, translateNewsItem } = props;
    const { newsSelected } = newsSelectInfo || {};
    const { loading: loadingTranslate } = newsTranslateInto || {};
    const { sentences } = newsSelected || {};

    const renderButtons = (): JSX.Element => {
        return (
            <div 
                className="d-flex justify-content-between px-5"
                id="note-btn-container"
            >
                <div>
                    { sentences && sentences.length
                        ? <button 
                            className="capsule-lg"
                            style={{ display: 'flex', flexDirection: 'row' }}
                            onClick={e => translateNewsItem(newsSelected)} 
                        >
                            { loadingTranslate ? <Loader size="23px"/> : null }
                            <span>&nbsp;Translate</span>
                        </button>
                        : null
                    }
                </div>
                <div>
                    <Link to='/notes/new' className='capsule-lg' target='_blank'>
                        Add Note
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Row className="my-3">
                <Col>
                    <SearchBar />
                </Col>
            </Row>
            <Row className="my-3">
                <Col lg={5} xl={4}>
                    <NewsList /> 
                </Col>
                <Col lg={7} xl={8}>
                    <NewsSelected areButtonsRendered={false} />
                    { renderButtons() }
                </Col>
            </Row>
        </div>
    );
};

const mapStateToProps = (state: StoreState): NewsScreenState => {
    return {
        newsSelectInfo: state.newsSelectInfo,
        newsTranslateInto: state.newsTranslateInfo
    };
};

export default connect<NewsScreenState, NewsScreenDispatch, {}, StoreState>(
    mapStateToProps,
    { translateNewsItem }
)(NewsScreen);