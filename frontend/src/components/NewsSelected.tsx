import React from 'react'
import { connect } from 'react-redux';
import { ListGroup, Button, Row, Col } from 'react-bootstrap';

import Loader from './Loader';
import Message from './Message';

import { StoreState } from '../types/storeTypes';
import { NewsSelectInfo } from '../types/newsTypes';
import { NewsTranslateInfo } from '../types/newsTypes';

import { translateNewsItem } from '../actions/newsActions';

interface NewsSelectedProps {
    newsSelectInfo: NewsSelectInfo,
    newsTranslateInfo: NewsTranslateInfo,
    translateNewsItem: Function
};

const NewsSelected = (props: NewsSelectedProps) => {

    const { 
        newsSelectInfo, newsTranslateInfo,
        translateNewsItem 
    } = props;

    const { loading: loadingSelected, errors: errorsSelected, newsSelected } = newsSelectInfo;
    const { title, paragraphs } = newsSelected || {};

    const { loading: loadingTranslated, errors: errorsTranslated, newsTranslated } = newsTranslateInfo;
    const { sentences, translations } = newsTranslated || {};

    const renderPost = () => {
        if (paragraphs && paragraphs.length) {
            return paragraphs.map((paragraph: string, i: Number) => {
                return (
                    <ListGroup.Item key={i.toString()}>
                        { paragraph }
                    </ListGroup.Item>
                );
            });
        } else {
            return null;
        }
    };

    return (
        <div className="boxed mycard p-5">
            
            <h3 className="text-center">{ 
                paragraphs && paragraphs.length 
                    ? title || "Title"
                    : "Select News from the List"
            }</h3>
            { loadingSelected || loadingTranslated ? <Loader /> : null }
            { errorsSelected || errorsTranslated 
                ? <Message variant='danger'>{errorsSelected || errorsTranslated}</Message> 
                : null 
            }
            { paragraphs && paragraphs.length
                ? <ListGroup variant='flush'>
                    { renderPost() }
                </ListGroup>
                : null
            }

            { paragraphs && paragraphs.length
                ? <Button onClick={e => translateNewsItem(newsSelected)}>
                    Translate
                </Button>
                : null
            }

            
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {
        newsSelectInfo: state.newsSelectInfo,
        newsTranslateInfo: state.newsTranslateInfo
    };
};

export default connect(
    mapStateToProps,
    { translateNewsItem }
)(NewsSelected);

