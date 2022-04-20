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
    const { title, sentences } = newsSelected || {};

    const { loading: loadingTranslated, errors: errorsTranslated, newsTranslated } = newsTranslateInfo;
    const { translations } = newsTranslated || {};

    const handleTranslate = () => {
        translateNewsItem(newsSelected);
    };

    const renderPost = () => {
        if (sentences && sentences.length) {
            return sentences.map((sentence: string, i: Number) => {
                return (
                    <ListGroup.Item key={i.toString()}>
                        { sentence }
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
                sentences && sentences.length 
                    ? title || "Title"
                    : "Select News from the List"
            }</h3>
            { loadingSelected || loadingTranslated ? <Loader /> : null }
            { errorsSelected || errorsTranslated 
                ? <Message variant="danger">{ errorsSelected || errorsTranslated }</Message> 
                : null 
            }
            { sentences && sentences.length
                ? <ListGroup variant="flush">
                    { renderPost() }
                </ListGroup>
                : null
            }

            <div className="d-flex justify-content-between mt-5">
                <div>
                    { sentences && sentences.length
                        ? <button className="capsule-lg" onClick={handleTranslate} >
                            Translate
                        </button>
                        : null
                    }
                </div>
                <div>
                    <button className="capsule-lg">Make a Note</button>
                </div>
            </div>

            

            
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

