import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import { RootState } from '../types/generalTypes';
import { NewsListInfo } from '../types/newsTypes';
import { getNewsList } from '../actions/newsActions';


interface SearchBarProps {
    newsListInfo: NewsListInfo,
    getNewsList: (params: { q: string }) => {}
};

const SearchBar = (props: SearchBarProps) => {

    console.log(props);
    const { newsListInfo, getNewsList } = props;
    const { errors, loading, newsList } = newsListInfo;

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

            <div>
                { errors ? errors : null }
                { loading ? "loading..." : null }
                <pre><code>
                    Result: {JSON.stringify(newsList, null, 2)}
                </code></pre>
            </div>
        </Container>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        newsListInfo: state.newsListInfo
    };
};

export default connect(
    mapStateToProps,
    { getNewsList }
)(SearchBar);