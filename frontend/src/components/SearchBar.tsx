import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import { StoreState } from '../types/storeTypes';
import { NewsListInfo } from '../types/newsTypes';
import { getNewsList } from '../actions/newsActions';


interface SearchBarState {
    newsListInfo: NewsListInfo
}

interface SearchBarDispatch {
    getNewsList: (params: { q: string }) => {}
}

const SearchBar = (props: SearchBarState & SearchBarDispatch): JSX.Element => {

    console.log(props);
    const { getNewsList } = props;

    const [ query, setQuery ] = useState('');

    const onFormSubmit = (evt: React.SyntheticEvent): void => {
        evt.preventDefault();
        console.log(`form submitted: q=${query}`);
        getNewsList({q: query});
    };

    return (
        <Container className="boxed mycard p-5" id="box-filter">
            <h3 className="text-center">Search by Keyword</h3>
            <Form onSubmit={onFormSubmit}>
                <Form.Group controlId="query" className="my-2" id="query-container">
                    <Form.Control 
                        type="text" 
                        placeholder="Enter Keyword" 
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </Form.Group>

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

export default connect(
    mapStateToProps,
    { getNewsList }
)(SearchBar);