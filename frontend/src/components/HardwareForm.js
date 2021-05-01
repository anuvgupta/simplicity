import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
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
            hwSetID: "hwSetA",
            respData: {},
            amount: "",
            quantity: 0,
            msg: "",
            color: "",
            hwList: {},
            projectID: '',
            pricing: 0,
            cost: 0,
            link_bill_id: ''
        };
        this.billRef = React.createRef();
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

    scrollToBillRef() {
        return window.scrollTo(0, this.billRef.current.offsetTop);
    }

    getHardwareInfo(token, resolve) {
        axios.post(`${global.config.api_url}/checkHardware`, {},
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(response => {
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
        console.log('HardwareForm: loading user ' + user.username);
        var project_id = '';
        if (this.props.match.params.hasOwnProperty('id'))
            project_id = (`${this.props.match.params.id}`).trim();
        let query = new URLSearchParams(this.props.location.search);
        var link_bill_id = null;
        var scrollToBill = false;
        if (query.has('bill')) {
            scrollToBill = true;
            link_bill_id = query.get('bill').trim();
            this.setState({
                link_bill_id: link_bill_id,
                msg: "Check in succeeded & bill processed.",
                color: "green"
            });
        }
        this.setState({
            token: user.token,
            projectID: `${project_id}`
        });
        this.getHardwareInfo(user.token, (resp, error = null) => {
            if (resp) {
                var hwSetID = this.state.hwSetID;
                var hwSet = null;
                if (resp.data.hasOwnProperty(hwSetID))
                    hwSet = resp.data[hwSetID];
                // console.log(hwSetID);
                // console.log(resp.data[hwSetID]);
                this.setState({
                    amount: resp.data[hwSetID].available,
                    hwList: resp.data,
                    pricing: hwSet && (hwSet.price),
                    cost: hwSet && (hwSet.price * this.state.quantity),
                })
                setTimeout((_ => {
                    this.scrollToBillRef();
                }).bind(this), 100);
            } else {
                console.log(error);
            }
        });

        // this.updateSetID(user.token, "hwSet1");
        // console.log("this is what im looking for: " + resp);

        // TODO: load user data/info
    }



    updateSetID(event) {
        // console.log(event.target.value);
        // console.log(this.state.token)
        this.setState({
            hwSetID: event.target.value
        });
        this.getHardwareInfo(this.state.token, (resp, error = null) => {
            if (resp) {
                var hwSetID = this.state.hwSetID;
                var hwSet = null;
                if (resp.data.hasOwnProperty(hwSetID))
                    hwSet = resp.data[hwSetID];
                // console.log(hwSetID);
                // console.log(resp.data[hwSetID]);
                // console.log(resp);
                this.setState({
                    amount: hwSet && (hwSet.available),
                    pricing: hwSet && (hwSet.price),
                    cost: hwSet && (hwSet.price * this.state.quantity),
                });
            } else {
                console.log(error);
            }
        });
    }
    updateQuantity(event) {
        // console.log(event.target.value);
        var val = event.target.value;
        try {
            val = parseInt(val);
        } catch (e) { val = 0; }
        if (isNaN(val) || !val)
            val = 0
        this.setState({
            quantity: val,
            cost: val * this.state.pricing
        });
    }
    checkHardware(isCheckin) {
        this.setState({
            link_bill_id: ''
        });
        // console.log(this.state);
        // TODO: POST request here to check out / check in data
        if (isCheckin) {
            //TODO: POST checkin
            axios.post(`${global.config.api_url}/checkInHardware`, {
                id: `${this.state.hwSetID}`,
                quantity: `${this.state.quantity}`,
                usage: `${this.props.usage}`,
                project_id: `${this.state.projectID}`
            }, {
                headers: { Authorization: `Bearer ${this.state.token}` }
            }).then(response => {
                var resp_data = null;
                if (response && response.data)
                    resp_data = response.data;
                // console.log(this.state);
                // console.log(resp_data);
                this.getHardwareInfo(this.state.token, (resp, error = null) => {
                    if (resp) {
                        var hwSetID = this.state.hwSetID;
                        this.setState({
                            amount: resp.data[hwSetID].available,
                            msg: "Success!",
                            color: "green"
                        });
                        var newLocation = String(`${window.location.origin}${window.location.pathname}?bill=${resp_data.data && resp_data.data.bill_id ? resp_data.data.bill_id : ''}`);
                        window.location = String(newLocation);
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
                id: `${this.state.hwSetID}`,
                quantity: `${this.state.quantity}`,
                usage: `${this.props.usage}`,
                project_id: `${this.state.projectID}`
            }, {
                headers: { Authorization: `Bearer ${this.state.token}` }
            }).then(response => {
                var resp_data = null;
                if (response && response.data)
                    resp_data = response.data;
                this.getHardwareInfo(this.state.token, (resp, error = null) => {
                    if (resp) {
                        var hwSetID = this.state.hwSetID;
                        var hwSet = resp.data[hwSetID];
                        this.setState({
                            amount: hwSet.available,
                            msg: "Success!",
                            color: "green"
                        });
                        var newLocation = String(`${window.location.origin}${window.location.pathname}`);
                        window.location = String(newLocation);
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
                    <div className="centerTitle" style={{ marginBottom: '10px' }}>
                        <h1 style={{ fontSize: '2.2em' }}> Request Hardware </h1>
                        <h6 style={{ color: '#444', fontStyle: 'italic', letterSpacing: '0.6px', marginTop: '-2px', fontSize: '16px' }}> {(this.props.usage == 'personal' ? 'Personal' : 'Project/Shared')} Usage </h6>
                    </div>
                    <div className="hardwareForm" style={{ marginBottom: '33px' }}>
                        <Form.Group>
                            <Form.Label style={{ marginTop: '1em', fontSize: '19px' }}> Hardware Set </Form.Label>
                            <Form.Control as="select" onChange={this.updateSetID.bind(this)}>
                                {Object.keys(this.state.hwList).length > 0 ?
                                    Object.values(this.state.hwList).map((hw_set, i) => (
                                        <option value={hw_set.hardware_id} key={i}>{hw_set.name}</option>
                                    )) : ''}
                            </Form.Control>
                            <Form.Label style={{ marginTop: '1em', fontSize: '19px' }}> Request Capacity (GB) </Form.Label>
                            <Form.Control type="text" placeholder="10" onChange={this.updateQuantity.bind(this)} />
                            <Form.Label style={{ marginTop: '1em', fontSize: '19px' }}> Total Availability (GB) </Form.Label>
                            <Form.Control type="text" value={this.state.amount} disabled />
                            <Form.Label style={{ marginTop: '1em', fontSize: '19px', display: 'block' }}> Projected Pricing &amp; Cost </Form.Label>
                            <Form.Control style={{ width: 'calc(50% - 3px)', display: 'inline-block', boxSizing: 'border-box', marginRight: '3px' }} type="text" value={`$${this.state.pricing.toFixed(2)}/GB`} disabled />
                            <Form.Control style={{ width: 'calc(50% - 3px)', display: 'inline-block', boxSizing: 'border-box', marginLeft: '3px' }} type="text" value={`$${this.state.cost.toFixed(2)}`} disabled />
                            <div style={{ marginTop: '14px', color: '#4d4d4d', fontStyle: 'italic', fontSize: '15px' }}><span> Priced by # GB used. Bill will be applied upon check in. </span></div>
                        </Form.Group>
                    </div>
                    <Button variant="outlined" color="default" style={{ marginRight: '3px' }} className="mt9px" onClick={this.checkHardware.bind(this, false)}>
                        Check Out
                    </Button>
                    {' '}
                    <Button variant="outlined" color="default" style={{ marginLeft: '3px' }} className="mt9px" onClick={this.checkHardware.bind(this, true)} >
                        Check In
                    </Button>
                    <div style={{ marginTop: '30px' }} id="bill" ref={this.billRef}>
                        <span style={{ display: 'block', marginBottom: '7px' }} className={this.state.color}>{this.state.msg}</span>
                        <Button variant="outlined" color="default" style={{ marginRight: '3px', display: (this.state.link_bill_id != '' ? 'inline-block' : 'none') }} className="mt9px" href={(`${window.location.origin}/billing?id=${this.state.link_bill_id}`)}>
                            View Bill
                        </Button>
                    </div>
                </div>
            </div>

        );
    }
}

export default withRouter(HardwareForm);