import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Loader from './Loader';
import Message from './Message';

import { logout } from '../actions/userActions';

import { StoreState } from '../types/storeTypes';
import { UserLoginInfo } from '../types/userTypes';

interface UserTokenCheckerState {
    userLoginInfo: UserLoginInfo
}

interface UserTokenCheckerDispatch {
    logout: Function
}

interface JWToken {
    token_type: string,
    exp: number,
    jti: string
}

const UserTokenChecker = (
    props: UserTokenCheckerState & UserTokenCheckerDispatch
): JSX.Element => {

    const { userLoginInfo, logout } = props;
    const { loading: loadingUserInfo, errors: errorsUserInfo, userDetail } = userLoginInfo || {};

    const history = useHistory();

    // logout user if its token is expired
    useEffect(() => {
        if (userDetail && userDetail.token) {
            // check user token on page change
            history.listen(() => {
                const userData = jwtDecode<JWToken>(userDetail.token);
                
                if ( new Date() > new Date(userData.exp * 1000) ) {
                    logout();
                }
            });            
        }
    }, [ history, userDetail, logout ]);

    return (
        <div>
            { loadingUserInfo ? <Loader /> : null }
            { errorsUserInfo ? <Message variant='danger'>{errorsUserInfo}</Message> : null }
        </div>
    );
};

const mapStateToProps = (state: StoreState): UserTokenCheckerState => {
    return {
        userLoginInfo: state.userLoginInfo
    };
};

export default connect<UserTokenCheckerState, UserTokenCheckerDispatch, {}, StoreState>(
    mapStateToProps, 
    { logout }
)(UserTokenChecker);