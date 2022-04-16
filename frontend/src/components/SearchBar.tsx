import React from 'react';
import { connect } from 'react-redux';

interface SearchBarProps {};
interface RootState {};

const SearchBar = (props: SearchBarProps) => {
    return (
        <div>
            Search Bar
        </div>
    );
};

const mapStateToProps = (state: RootState) => {
    return {};
};

export default connect(
    mapStateToProps,
    {}
)(SearchBar);