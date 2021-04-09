import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios'
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
// import '../styles/project.css'


class HardwareForm extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    componentDidMount() {
        global.api.authenticated((user => {
            if (user === false) this.redirectPage();
            else this.setupPage(user.username);
        }).bind(this));
    }
    componentWillUnmount() {

    }

    redirectPage() {
        this.props.history.push('/home');
    }

    setupPage(username) {
        console.log('HardwareForm: loading user ' + username);
        // TODO: load user data/info
    }

    updateUsername(event) {
        this.setState({
            username: event.target.value
        });
    }

    updatePassword(event) {
        this.setState({
            password: event.target.value
        });
    }

    requestSignIn() {
        var username = this.state.username;
        var password = this.state.password;
        if (username && password && username.trim().length > 0 && password.trim().length > 0) {
            console.log(username, password);
        }
    }

    render() {
        return (
            <div className="formCenter">
                <Form>
                    <Form.Group controlId="projectName">
                        <Form.Label>HW Set Name</Form.Label>
                        <Form.Control type="name" placeholder="GPU" />
                        <Form.Label>Requested Capacity </Form.Label>
                        <Form.Control type="name" placeholder="1 GB" />
                        <Form.Label>Total Available</Form.Label>
                        <Form.Control type="name" placeholder="16 GB" />
                        {/* <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} /> */}
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export default withRouter(HardwareForm);