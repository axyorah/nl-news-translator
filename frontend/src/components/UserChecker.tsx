import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Loader from './Loader';
import Message from './Message';

import { StoreState } from '../types/storeTypes';
import { UserLoginInfo } from '../types/userTypes';

interface UserCheckerState {
    userLoginInfo: UserLoginInfo
}

const UserChecker = (props: UserCheckerState): JSX.Element => {

    const { userLoginInfo } = props;
    const { loading: loadingUserInfo, errors: errorsUserInfo, userDetail } = userLoginInfo || {};

    const history = useHistory();

    // redirect to login page if anonymous user
    useEffect(() => {
        if (!userDetail) {
            history.push('/login');
        }
    }, [ history, userDetail]);

    return (
        <div>
            { loadingUserInfo ? <Loader /> : null }
            { errorsUserInfo ? <Message variant='danger'>{errorsUserInfo}</Message> : null }
            { userDetail 
                ? null 
                : <Message variant='danger'>You need to be logged in to view this page!</Message>
            }
        </div>
    );
};

const mapStateToProps = (state: StoreState): UserCheckerState => {
    return {
        userLoginInfo: state.userLoginInfo
    };
};

export default connect<UserCheckerState, {}, {}, StoreState>(
    mapStateToProps, 
    {}
)(UserChecker);