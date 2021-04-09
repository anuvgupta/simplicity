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
        console.log('HardwareForm: loading user ' + user.token);
        this.setState({
            token: user.token
        });
        var resp = this.getHardwareInfo(user.token, (response, error = null) => {
            if (response) {
                var hwSetName = this.state.hwSetName;
                console.log(hwSetName);
                console.log(response.data[hwSetName]);
                this.setState({
                    amount: response.data[hwSetName]
                })
            } else {
                console.log(error);
            }
        });

        // this.updateSetName(user.token, "hwSet1");
        console.log("this is what im loking for: " + resp);

        // TODO: load user data/info
    }
    getHardwareInfo(token, resolve) {
        var resp = "";
        axios.post(`${global.config.api_url}/checkHardware`, {},
            {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
                var resp_data = null;
                if (response && response.data)
                    resp_data = response.data;
                // resp = resp_data.data;
                // this.setState({
                //     respData: resp_data.data
                // })

                console.log(this.state);
                console.log(resp_data);
                resolve(resp_data);
            }).catch(error => {
                if (error) {
                    var resp_data = null;
                    if (error.response && error.response.data)
                        resp_data = error.response.data;
                    console.log(error, resp_data);
                    console.log("here");
                    resolve(false, resp_data);
                }
            });
        return resp;
    }


    updateSetName(event) {
        console.log(event.target.value);
        // console.log(this.state.token)
        this.setState({
            hwSetName: event.target.value
        });
        var resp = this.getHardwareInfo(this.state.token, (response, error = null) => {
            if (response) {
                var hwSetName = this.state.hwSetName;
                console.log(hwSetName);
                console.log(response.data[hwSetName]);
                this.setState({
                    amount: response.data[hwSetName]
                });
            } else {
                console.log(error);
            }
        });
    }
    updateAmount(event) {
        console.log(event.target.value);
        this.setState({
            amount: event.target.value
        });
    }
    checkHardware(isCheckin) {
        console.log(this.state);
        // TODO: POST request here to check out / check in data
        if (isCheckin) {
            //TODO: POST checkin
        }
        else {
            //TODO: POST checkout
        }
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
                            <Form.Control type="name" value={this.state.amount} disabled />
                            {/* <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} /> */}
                        </Form.Group>
                    </Form>
                    <Button className="mt9px" onClick={this.checkHardware.bind(this, true)} >
                        Check In
                        </Button> {' '}
                    <Button className="mt9px" onClick={this.checkHardware.bind(this, false)}>
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