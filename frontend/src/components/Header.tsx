import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useHistory } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { StoreState } from '../types/storeTypes';
import { UserLoginInfo } from '../types/userTypes';

import { logout } from '../actions/userActions';


interface HeaderState {
    userLoginInfo: UserLoginInfo
}

interface HeaderDispatch {
    logout: Function
}

interface JWToken {
    token_type: string,
    exp: number,
    jti: string
}

const Header = (props: & HeaderState & HeaderDispatch): JSX.Element => {

    const { userLoginInfo, logout } = props;
    const { userDetail } = userLoginInfo || {};

    // logout user if its token expired
    const history = useHistory();
    useEffect(() => {
        // check token on page change
        history.listen(() => {
            if (userDetail && userDetail.token) {
                const userData = jwtDecode<JWToken>(userDetail.token);
            
                if ( new Date() > new Date(userData.exp * 1000) ) {
                    logout();
                    userDetail.token = '';
                }
            }
        });
    }, [history, userDetail, logout])

    return (
        <Navbar bg="dark" variant="dark" expand="md">
            <Container>
                <Navbar.Brand as={Link} to="/">HOME</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    { userDetail && userDetail.username 
                        ? <Nav className="me-auto">
                            <Nav.Link as={Link} to="/notes">My Notes</Nav.Link>
                            <Nav.Link as={Link} to="/tags">My Tags</Nav.Link>
                        </Nav>
                        : null
                    }

                    { userDetail && userDetail.username 
                        ? <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/profile">{userDetail.username}</Nav.Link>
                            <Nav.Link as={Link} to="/" onClick={() => logout()}>Logout</Nav.Link>
                        </Nav>
                        : <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/login">Login/Sign Up</Nav.Link>
                        </Nav>
                    }

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

const mapStateToProps = (state: StoreState): HeaderState => {
    return {
        userLoginInfo: state.userLoginInfo
    }
};

export default connect<HeaderState, HeaderDispatch, {}, StoreState>(
    mapStateToProps,
    { logout }
)(Header);