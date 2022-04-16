import React from 'react';
import { connect } from 'react-redux';

import SearchBar from '../components/SearchBar';

interface RootState {};
interface NewsScreenProps {};

const NewsScreen = (props: NewsScreenProps) => {
    return (
        <div>
            News

            <SearchBar />
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