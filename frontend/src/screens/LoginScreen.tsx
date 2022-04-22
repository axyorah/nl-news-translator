import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import '../style/forms.css';

import Message  from '../components/Message';

import { StoreState } from '../types/storeTypes';
import { UserLoginInfo } from '../types/userTypes';

import { loginUser } from '../actions/userActions';

interface LoginScreenProps {
    userLoginInfo: UserLoginInfo,
    loginUser: Function
};

const LoginScreen = (props: LoginScreenProps): JSX.Element => {

    const { userLoginInfo, loginUser } = props;
    const { loading, errors, userDetail } = userLoginInfo;

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ formError, setFormError ] = useState('');

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

            { errors || formError 
                ? <Message variant='danger'>{ errors || formError }</Message>
                : null
            }

            <h3 className='text-center'>Login</h3>

            <Form onSubmit={onFormSubmit}>
                <Form.Group className='my-3'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type='text'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className='my-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
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
                    <Link to='/register'>Sign Up!</Link>
                </small>
            </div>
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {
        userLoginInfo: state.userLoginInfo
    };
};

export default connect(
    mapStateToProps,
    { loginUser }
)(LoginScreen);