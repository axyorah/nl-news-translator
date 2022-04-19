import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import SearchBar from '../components/SearchBar';
import NewsList from '../components/NewsList';

interface RootState {};
interface NewsScreenProps {};

const NewsScreen = (props: NewsScreenProps) => {
    return (
        <div>
            <Row className="my-3">
                <Col>
                    <SearchBar />
                </Col>
            </Row>
            <Row className="my-3">
                <Col lg={5}>
                    <NewsList /> 
                </Col>
                <Col lg={7}>
                    Selected
                </Col>
            </Row>
        </div>
    );
};

const mapStateToProps = (state: RootState) => {
    console.log(state);
    return {};
};

export default connect(
    mapStateToProps,
    {}
)(NewsScreen);