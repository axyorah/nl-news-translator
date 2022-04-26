import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import Message  from '../components/Message';
import Loader from '../components/Loader';

import { StoreState } from '../types/storeTypes';
import { UserLoginInfo } from '../types/userTypes';

import { registerUser } from '../actions/userActions';


interface RegisterScreenState {
    userRegisterInfo: UserLoginInfo
}

interface RegisterScreenDispatch {
    registerUser: Function
}


const RegisterScreen = (
    props: RouteComponentProps & RegisterScreenState & RegisterScreenDispatch
): JSX.Element => {

    const { 
        location, history,
        userRegisterInfo, registerUser 
    } = props;
    const { loading, errors, userDetail } = userRegisterInfo;

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ formError, setFormError ] = useState('');

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        // redirect user if registered
        if (userDetail) {
            history.push(redirect);
            // noteUpdateReset
        }
    }, [ history, userDetail, redirect ]);

    const onFormSubmit = (evt: React.SyntheticEvent): void => {
        evt.preventDefault();
        setFormError('');

        if (!username || !password || !confirmPassword) {
            setFormError('Please fill in all three fields!');
            return;
        }

        if (password !== confirmPassword) {
            setFormError('Passwords do not match!');
            return;
        }

        registerUser(username, password);
    };

    return (
        <div className="boxed mycard p-5">


            <h3 className='text-center'>Register</h3>

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

                <Form.Group className='my-3'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        required 
                        type='password'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>

                <Button type='submit'>Submit</Button>
            </Form>

            <div className='text-center'>
                <small className='text-muted'>
                    Already have an account?
                    <Link 
                        to={redirect ? `/login?redirect=${redirect}` : '/login'}
                    >Login!</Link>
                </small>
            </div>
        </div>
    );
};

const mapStateToProps = (state: StoreState): RegisterScreenState => {
    return {
        userRegisterInfo: state.userRegisterInfo
    };
};

export default connect(
    mapStateToProps,
    { registerUser }
)(RegisterScreen);