import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

function HomePage(props) {
    return (
        <div>
            <div className="centerTitle">
                <h1> Welcome to [NAME TBD] </h1>
            </div>
            <div className="homepageOptions">
                <Button href="/login"> Login</Button> {' '}
                <Button href="login"> Sign Up </Button>
            </div>
        </div>
    );
}

export default HomePage;