import React, { useState } from 'react'
import { connect } from 'react-redux';
import { ListGroup, Row, Col } from 'react-bootstrap';

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

    const [ errors, setErrors ] = useState('');


    const renderSentences = () => {
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

    const renderTranslations = () => {
        if (sentences && sentences.length && translations && translations.length) {
            if (sentences.length !== translations.length) {
                setErrors(`
                    Something went wrong while translating '${title}': 
                    There should be the same number of original and 
                    translated sentences, got ${sentences.length} and ${translations.length}.
                `);
                return null;
            }
            return translations.map((translation: string, i: number) => {
                const sentence = sentences[i];
                return (
                    <ListGroup.Item key={i.toString()}>
                        <Row>
                            <Col md={6}>{ sentence }</Col>
                            <Col md={6}>{ translation }</Col>
                        </Row>
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
            
            { errorsSelected || errorsTranslated || errors
                ? <Message variant="danger">{ 
                    errorsSelected || errorsTranslated || errors
                }</Message> 
                : null 
            }
            
            { translations && translations.length
                ? renderTranslations()
                : sentences && sentences.length
                    ? <ListGroup variant="flush">
                        { renderSentences() }
                    </ListGroup>
                    : null
            }

            <div className="d-flex justify-content-between mt-5">
                <div>
                    { sentences && sentences.length
                        ? <button 
                            className="capsule-lg" 
                            onClick={e => translateNewsItem(newsSelected)} 
                        >
                            Translate
                        </button>
                        : null
                    }
                </div>
                <div>
                    <button 
                        className="capsule-lg"
                        onClick={e => console.log('TODO: Make-a-Note!')}
                    >
                        Make a Note
                    </button>
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

