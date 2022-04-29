import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

import { StoreState } from '../types/storeTypes';
import { NewsListInfo } from '../types/newsTypes';
import { getNewsList } from '../actions/newsActions';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';


interface SearchBarState {
    newsListInfo: NewsListInfo
}

interface SearchBarDispatch {
    getNewsList: Function
}

const CATEGORIES = [
    'business', 
    'entertainment', 
    'general', 
    'health', 
    'science', 
    'sports', 
    'technology'
];

interface CategoryState {
    [category: string]: boolean
}

const SearchBar = (props: SearchBarState & SearchBarDispatch): JSX.Element => {

    const { getNewsList } = props;

    const [ query, setQuery ] = useState<string>('');
    const [ categories, setCategories ] = useState<CategoryState>({
        'business': false, 
        'entertainment': false, 
        'general': true, 
        'health': false, 
        'science': false, 
        'sports': false, 
        'technology': false
    });

    const renderCategories = (): JSX.Element[] | null => {
        return CATEGORIES.map((category: string) => {
            return (
                <Col key={category}>
                    <Form.Check 
                        type='checkbox'
                        label={category}
                        checked={categories[category]}
                        onChange={e => {
                            const newCategories = {...categories};
                            newCategories[category] = !categories[category];
                            setCategories(newCategories);
                        }}
                    />
                </Col>
            );
        });
    };

    const renderBar = () => {
        return (
            <Form.Control 
                type="text" 
                placeholder="Enter Keyword" 
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
        );
    };

    const onFormSubmit = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        console.log(Object.keys(categories).filter(cat => categories[cat]))
        getNewsList({
            q: query, 
            category_list: Object.keys(categories).filter(cat => categories[cat])
        });
    };

    

    return (
        <Container className="boxed mycard p-5" id="box-filter">
            <h3 className="text-center">Search by Keyword</h3>
            <Form onSubmit={onFormSubmit}>

                <Row>
                    { renderCategories() }
                </Row>

                <Row className='my-2'>
                    { renderBar() }
                </Row>

                <Button variant="secondary" className="w-100 my-2" type="submit">
                    Search
                </Button>
            </Form>
        </Container>
    );
};

const mapStateToProps = (state: StoreState): SearchBarState => {
    return {
        newsListInfo: state.newsListInfo
    };
};

export default connect<SearchBarState, SearchBarDispatch, {}, StoreState>(
    mapStateToProps,
    { getNewsList }
)(SearchBar);