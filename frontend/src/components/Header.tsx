import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = (): JSX.Element => {
    return (
        <Navbar bg="dark" variant="dark" expand="md">
            <Container>
                <Navbar.Brand as={Link} to="/">HOME</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">                        
                        <Nav.Link as={Link} to="/users">My Account</Nav.Link>
                        <Nav.Link as={Link} to="/notes">My Notes</Nav.Link>
                        <Nav.Link as={Link} to="/tags">My Tags</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">                        
                        <Nav.Link as={Link} to="/login">Login/Sign Up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;