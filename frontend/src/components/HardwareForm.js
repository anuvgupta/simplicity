import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios'
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import '../styles/hardware.css'


class HardwareForm extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            hwSetName: "hwSet1",
            amount: "",
            msg: "",
            color: ""
        };
    }

    componentDidMount() {
        global.api.authenticated((user => {
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
        console.log('HardwareForm: loading user ' + user.username);
        // TODO: load user data/info
    }

    updateSetName(event) {
        console.log(event.target.value);
        this.setState({
            hwSetName: event.target.value
        });
    }
    updateAmount(event){
        console.log(event.target.value);
        this.setState({
            amount: event.target.value
        });
    }
    checkHardware(){
        console.log(this.state);
        // TODO: POST request here to check out / check in data
    }

    render() {
        return (
            <div className="formCard">
                <div className="formCenter">
                    <Form>
                        <Form.Group controlId="projectName">
                            <Form.Label>HW Set Name</Form.Label>
                            <Form.Control as="select" onChange={this.updateSetName.bind(this)}>
                                <option>hwSet1</option>
                                <option>hwSet2</option>
                            </Form.Control>
                            <Form.Label>Requested Capacity </Form.Label>
                            <Form.Control type="name" placeholder="1 GB" onChange={this.updateAmount.bind(this)} />
                            <Form.Label>Total Available</Form.Label>
                            <Form.Control type="name" placeholder="16 GB" disabled />
                            {/* <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} /> */}
                        </Form.Group>
                    </Form>
                    <Button className="mt9px" onClick={this.checkHardware.bind(this)} >
                        Check In
                        </Button> {' '}
                    <Button className="mt9px" onClick={this.checkHardware.bind(this)}>
                        Check Out
                        </Button>
                    <div style={{ marginTop: '30px' }}>
                        <span className={this.state.color}>{this.state.msg}</span>
                    </div>
                </div>
            </div>

        );
    }
}

export default withRouter(HardwareForm);