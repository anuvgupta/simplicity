import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios'
// import '../styles/project.css'


class HardwareForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    componentDidMount() {

    }
    componentWillUnmount() {

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
            <div className="center">
                <div className="formBorder">
                    <div className="centerTitle">
                        <h1> Checkout Hardware </h1>
                    </div>
                    {/*a name, capacity, and available capacity */}
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
            </div>
        );
    }
}

export default HardwareForm;