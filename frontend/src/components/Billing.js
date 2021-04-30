import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Container, CardDeck, Card, Table } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import '../styles/billing.css'

class Billing extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {

        };
    }


    componentDidMount() {
        global.api.authenticate((user => {
            if (user === false) this.redirectPage();
            else this.setupPage(user);
        }).bind(this));
    }
    componentWillUnmount() {

    }

    redirectPage() {
        this.props.history.push('/home');
    }

    setupPage(user) {
        console.log('Billing: loading user ' + user.username);
        // TODO: load user data/info
    }

    render() {
        return (
            <div className="rightSide" style={{ marginTop: '100px', marginBottom: '45px' }} >
                <h1> Billing </h1>
                <div className="datasets" style={{ marginTop: '35px' }}>

                </div>
            </div>
        );
    }
}


export default withRouter(Billing);