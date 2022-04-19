import React from 'react'
import { connect } from 'react-redux';
import { ListGroup, Row, Col } from 'react-bootstrap';

import Loader from './Loader';
import Message from './Message';

import { StoreState } from '../types/storeTypes';
import { NewsSelectInfo } from '../types/newsTypes';
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';

interface NewsSelectedProps {
    newsSelectInfo: NewsSelectInfo
};

const NewsSelected = (props: NewsSelectedProps) => {

    const { newsSelectInfo } = props;
    const { loading, errors, paragraphs } = newsSelectInfo;

    const renderPost = () => {
        return paragraphs.map((paragraph: string, i: Number) => {
            return (
                <ListGroup.Item key={i.toString()}>
                    { paragraph }
                </ListGroup.Item>
            );
        });
    };

    return (
        <div className="boxed mycard p-5">
            
            <h3 className="text-center">{ 
                paragraphs && paragraphs.length 
                    ? "This Should be a Title"
                    : "Select News from the List"
            }</h3>
            { loading ? <Loader /> : null }
            { errors ? <Message variant='danger'>{errors}</Message> : null }
            {
                paragraphs && paragraphs.length
                    ? <ListGroup variant='flush'>
                        { renderPost() }
                    </ListGroup>
                    : null
            }
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {
        newsSelectInfo: state.newsSelectInfo
    };
};

export default connect(
    mapStateToProps,
    {}
)(NewsSelected);

