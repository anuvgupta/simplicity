import React, { useState } from 'react';
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
            token: "",
            hwSetName: "hwSet1",
            respData: {},
            amount: "",
            quantity: "",
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
    getHardwareInfo(token, resolve) {
        axios.post(`${global.config.api_url}/checkHardware`, {},
            {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
                var resp_data = null;
                if (response && response.data)
                    resp_data = response.data;
                // console.log(this.state);
                // console.log(resp_data);
                resolve(resp_data);
            }).catch(error => {
                if (error) {
                    var resp_data = null;
                    if (error.response && error.response.data)
                        resp_data = error.response.data;
                    console.log(error, resp_data);
                    // console.log("here");
                    resolve(false, resp_data);
                }
            });
    }


    setupPage(user) {
        console.log('HardwareForm: loading user ' + user.token);
        this.setState({
            token: user.token
        });
        var resp = this.getHardwareInfo(user.token, (response, error = null) => {
            if (response) {
                var hwSetName = this.state.hwSetName;
                // console.log(hwSetName);
                // console.log(response.data[hwSetName]);
                this.setState({
                    amount: response.data[hwSetName]
                })
            } else {
                console.log(error);
            }
        });

        // this.updateSetName(user.token, "hwSet1");
        // console.log("this is what im looking for: " + resp);

        // TODO: load user data/info
    }



    updateSetName(event) {
        // console.log(event.target.value);
        // console.log(this.state.token)
        this.setState({
            hwSetName: event.target.value
        });
        var resp = this.getHardwareInfo(this.state.token, (response, error = null) => {
            if (response) {
                var hwSetName = this.state.hwSetName;
                // console.log(hwSetName);
                // console.log(response.data[hwSetName]);
                this.setState({
                    amount: response.data[hwSetName]
                });
            } else {
                console.log(error);
            }
        });
    }
    updateQuantity(event) {
        // console.log(event.target.value);
        this.setState({
            quantity: event.target.value
        });
    }
    checkHardware(isCheckin) {
        // console.log(this.state);
        // TODO: POST request here to check out / check in data
        if (isCheckin) {
            //TODO: POST checkin
            axios.post(`${global.config.api_url}/checkInHardware`, {
                name: `${this.state.hwSetName}`,
                quantity: `${this.state.quantity}`
            },
                {
                    headers: { Authorization: `Bearer ${this.state.token}` }
                }).then(response => {
                    var resp_data = null;
                    if (response && response.data)
                        resp_data = response.data;
                    // console.log(this.state);
                    // console.log(resp_data);
                    var resp = this.getHardwareInfo(this.state.token, (response, error = null) => {
                        if (response) {
                            var hwSetName = this.state.hwSetName;
                            this.setState({
                                amount: response.data[hwSetName],
                                msg: "Success!",
                                color: "green"
                            });
                            window.location.reload();
                        } else {
                            console.log(error);
                        }
                    });
                }).catch(error => {
                    if (error) {
                        var resp_data = null;
                        if (error.response && error.response.data)
                            resp_data = error.response.data;

                        if (error.response.status == 500) {
                            this.setState({
                                msg: "Unknown error",
                                color: "red"
                            });
                        } else {
                            this.setState({
                                msg: resp_data.message,
                                color: "red"
                            });
                        }
                    }
                });
        }
        else {
            //TODO: POST checkout
            axios.post(`${global.config.api_url}/checkOutHardware`, {
                name: `${this.state.hwSetName}`,
                quantity: `${this.state.quantity}`
            },
                {
                    headers: { Authorization: `Bearer ${this.state.token}` }
                }).then(response => {
                    var resp_data = null;
                    if (response && response.data)
                        resp_data = response.data;
                    var resp = this.getHardwareInfo(this.state.token, (response, error = null) => {
                        if (response) {
                            var hwSetName = this.state.hwSetName;
                            this.setState({
                                amount: response.data[hwSetName],
                                msg: "Success!",
                                color: "green"
                            });
                            window.location.reload();
                        } else {
                            console.log(error);
                        }
                    });
                }).catch(error => {
                    if (error) {
                        var resp_data = null;
                        if (error.response && error.response.data)
                            resp_data = error.response.data;
                        console.log(error.response.status);
                        if (error.response.status == 500) {
                            this.setState({
                                msg: "Unknown error",
                                color: "red"
                            });
                        } else {
                            this.setState({
                                msg: resp_data.message,
                                color: "red"
                            });
                        }
                        console.log(error, resp_data);
                    }
                });
        }
    }

    render() {
        return (
            <div className="formCard" style={{ padding: '60px 40px 40px 40px' }}>
                <div className="formCenter">
                    <div className="centerTitle" style={{ marginBottom: '15px' }}>
                        <h1> Check In/Out Hardware </h1>
                    </div>
                    <Form>
                        <Form.Group controlId="projectName">
                            <Form.Label style={{ marginTop: '1em' }}> Hardware Set </Form.Label>
                            <Form.Control as="select" onChange={this.updateSetName.bind(this)}>
                                <option>Hardware Set 1</option>
                                <option>Hardware Set 2</option>
                            </Form.Control>
                            <Form.Label style={{ marginTop: '1em' }}> Request Capacity </Form.Label>
                            <Form.Control type="name" placeholder="1 GB" onChange={this.updateQuantity.bind(this)} />
                            <Form.Label style={{ marginTop: '1em' }}> Total Availability </Form.Label>
                            <Form.Control type="name" value={this.state.amount} disabled />
                            {/* <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} /> */}
                        </Form.Group>
                    </Form>
                    <Button style={{ marginRight: '3px' }} className="mt9px" onClick={this.checkHardware.bind(this, false)}>
                        Check Out
                    </Button>
                    {' '}
                    <Button style={{ marginLeft: '3px' }} className="mt9px" onClick={this.checkHardware.bind(this, true)} >
                        Check In
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