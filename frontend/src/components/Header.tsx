import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { StoreState } from '../types/storeTypes';
import { UserLoginInfo } from '../types/userTypes';

import { logout } from '../actions/userActions';


interface HeaderState {
    userLoginInfo: UserLoginInfo
}

interface HeaderDispatch {
    logout: Function
}


const Header = (props: HeaderState & HeaderDispatch): JSX.Element => {

    const { userLoginInfo, logout } = props;
    const { userDetail } = userLoginInfo || {};

    const logoutHandler = () => {
        logout()
    };

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
                            <Nav.Link as={Link} to="#" onClick={logoutHandler}>Logout</Nav.Link>
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

export default connect(
    mapStateToProps,
    { logout }
)(Header);