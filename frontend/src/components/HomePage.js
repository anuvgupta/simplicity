import '../global.js'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import '../styles/homepage.css';

class HomePage extends React.Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        global.api.authenticated(is_authenticated => {
            if (is_authenticated) this.redirectPage();
        });
    }
    componentWillUnmount() {

    }

    redirectPage() {
        this.props.history.push('/account');
    }

    render() {
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
}

export default withRouter(HomePage);