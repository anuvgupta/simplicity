import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../styles/homepage.css';

function HomePage(props) {

    return (
        <div className="center">
            <Container>
                <Row>
                    <Col>
                        <div className="centerTitle">
                            <h1 className="title"> Welcome to Simplicity </h1>
                        </div>
                    </Col>
                </Row>
                <div className="homepageOptions">
                    <a href="/login"> Login</a> {' '}
                    <a href="/register"> Sign Up </a> {' '}
                    
                </div>






            </Container>
        </div>
    );
}

export default HomePage;