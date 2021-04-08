import '../global.js'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import '../styles/homepage.css';

function HomePage(props) {

    return (
        <div className="center h100">
            <Container>
                <Row>
                    <Col>
                        <div className="centerTitle">
                            <h1 className="title"> Welcome to Simplicity </h1>
                        </div>
                    </Col>
                </Row>
                <div className="homepageOptions">
                    <NavLink className="f100" to="/login"> Sign In </NavLink>
                    <NavLink className="f100" to="/register"> Sign Up </NavLink>
                </div>
            </Container>
        </div>
    );
}

export default HomePage;