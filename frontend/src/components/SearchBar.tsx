import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

import { StoreState } from '../types/storeTypes';
import { NewsListInfo } from '../types/newsTypes';
import { getNewsList } from '../actions/newsActions';


interface SearchBarState {
    newsListInfo: NewsListInfo
}

interface SearchBarDispatch {
    getNewsList: Function
}

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
        return Object.keys(categories).map((category: string) => {
            return (
                <Col 
                    key={category} 
                    className='btn btn-secondary m-1'
                    style={{
                        border: 'none',
                        backgroundColor: categories[category] 
                            ? 'rgb(80,80,89)' 
                            : 'rgb(108,117,125)'
                    }}
                >
                    <Form.Check 
                        type='checkbox'
                        id={category}
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
                type='text' 
                placeholder='Enter Keyword' 
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
        );
    };

    const onFormSubmit = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        getNewsList({
            q: query, 
            category_list: Object.keys(categories).filter(cat => categories[cat])
        });
    };    

    return (
        <Container className='boxed mycard p-5' id='box-filter'>
            <h3 className='text-center'>Search by Category or Keyword</h3>
            
            <Form onSubmit={onFormSubmit}>
                <Row>
                    { renderCategories() }
                </Row>

                <Row className='my-2'>
                    { renderBar() }
                </Row>

                <Button variant='secondary' className='w-100 my-2' type='submit'>
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