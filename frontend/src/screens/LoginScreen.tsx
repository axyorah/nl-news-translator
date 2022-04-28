import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import '../style/forms.css';

import Message  from '../components/Message';
import Loader from '../components/Loader';

import { StoreState } from '../types/storeTypes';
import { UserLoginInfo } from '../types/userTypes';

import { loginUser } from '../actions/userActions';


interface LoginScreenState {
    userLoginInfo: UserLoginInfo
}

interface LoginScreenDispatch {
    loginUser: Function
}


const LoginScreen = (
    props: RouteComponentProps & LoginScreenState & LoginScreenDispatch
): JSX.Element => {

    const { 
        location, history,
        userLoginInfo, loginUser 
    } = props;
    const { loading, errors, userDetail } = userLoginInfo;

    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');
    const [ formError, setFormError ] = useState<string>('');

    const redirect: string = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        // redirect user if already logged in
        if (userDetail) {
            history.push(redirect);
        }
    }, [ history, userDetail, redirect ]);

    const onFormSubmit = (evt: React.SyntheticEvent): void => {
        evt.preventDefault();

        if (!username || !password) {
            setFormError('Please specify both username and password!');
            return;
        }

        loginUser(username, password);
    };

    return (
        <div className="boxed mycard p-5">


            <h3 className='text-center'>Login</h3>

            { errors || formError 
                ? <Message variant='danger'>{ errors || formError }</Message>
                : null
            }
            { loading ? <Loader /> : null }


            <Form onSubmit={onFormSubmit}>

                <Form.Group className='my-3'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        required 
                        type='text'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className='my-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required 
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button type='submit'>Submit</Button>
            </Form>

            <div className='text-center'>
                <small className='text-muted'>
                    Don't have an account?
                    <Link 
                        to={redirect ? `/register?redirect=${redirect}` : '/register'}
                    >Sign Up!</Link>
                </small>
            </div>
        </div>
    );
};

const mapStateToProps = (state: StoreState): LoginScreenState => {
    return {
        userLoginInfo: state.userLoginInfo
    };
};

export default connect<LoginScreenState, LoginScreenDispatch, {}, StoreState>(
    mapStateToProps,
    { loginUser }
)(LoginScreen);