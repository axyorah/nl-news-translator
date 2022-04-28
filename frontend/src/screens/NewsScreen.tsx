import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { StoreState } from '../types/storeTypes';
import SearchBar from '../components/SearchBar';
import NewsList from '../components/NewsList';
import NewsSelected from '../components/NewsSelected';

interface NewsScreenState {};
interface NewsScreenDispatch {};

const NewsScreen = (
    props: RouteComponentProps & NewsScreenState & NewsScreenDispatch
): JSX.Element => {
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
                    <NewsSelected />
                </Col>
            </Row>
        </div>
    );
};

const mapStateToProps = (state: StoreState): NewsScreenState => {
    return {};
};

export default connect<NewsScreenState, NewsScreenDispatch, {}, StoreState>(
    mapStateToProps,
    {}
)(NewsScreen);