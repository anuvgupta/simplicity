
import '../global';
import React from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import { Form } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/project.css';


class PaymentForm extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            card_number: "",
            name_on_card: "",
            expiration: "",
            zipcode: "",
            errorMsg: "",
            errorMsgColor: "",
            redErrorMsgColor: "#c20c0c",
            greenErrorMsgColor: "green",
            defaultMethod: "",
            token: ""
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

    redirectPage(page = '') {
        this.props.history.push(`/${page}`);
    }

    setupPage(user) {
        console.log('PaymentForm: loading user ' + user.username);
        // TODO: load user data/info
        let query = new URLSearchParams(this.props.location.search);
        this.setState({
            token: user.token,
            username: user.username
        });
        axios.get(`${global.config.api_url}/user?username=${user.username}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log('resp_data', resp_data);
            if (resp_data && resp_data.success && resp_data.success === true && resp_data.data && resp_data.data.username) {
                user = resp_data.data;
                var defaultMethod = "";
                if (user.payment_set === true && (`${user.payment_rep}`).trim() != "")
                    defaultMethod = (`${user.payment_rep}`);
                this.setState({
                    defaultMethod: defaultMethod
                });
            } else console.log('Invalid response: ', resp_data);
        }).catch(error => {
            if (error) {
                var resp_data = null;
                if (error.response && error.response.data)
                    resp_data = error.response.data;
                console.log(error);
            }
        });
    }

    update_card_number(event) {
        this.setState({
            card_number: event.target.value
        });
    }

    update_name_on_card(event) {
        this.setState({
            name_on_card: event.target.value
        });
    }

    update_expiration(event) {
        this.setState({
            expiration: event.target.value
        });
    }

    update_zipcode(event) {
        this.setState({
            zipcode: event.target.value
        });
    }

    updateErrorMsg(value, color = this.state.redErrorMsgColor) {
        this.setState({
            errorMsg: value,
            errorMsgColor: color
        });
    }

    validateForm(sendRequest = false) {
        var card_number = (`${this.state.card_number}`).trim()
            .split(' ').join('').split('-').join('');
        var name_on_card = this.state.name_on_card;
        var expiration = this.state.expiration;
        var zipcode = this.state.zipcode;
        if (card_number && card_number.trim().length > 0) {
            if (name_on_card && name_on_card.trim().length > 0) {
                if (expiration && expiration.trim().length > 0) {
                    if (zipcode && zipcode.trim().length > 0) {
                        if (global.util.validateNumeric(card_number)) {
                            if (sendRequest) this.updatePaymentInfo(card_number, name_on_card, expiration, zipcode);
                        } else this.updateErrorMsg('Invalid card number (numbers only).');
                    } else this.updateErrorMsg('Empty zipcode.');
                } else this.updateErrorMsg('Empty expiration.');
            } else this.updateErrorMsg('Empty name on card.');
        } else this.updateErrorMsg('Empty card number.');
    }

    updatePaymentInfo(card_number, name_on_card, expiration, zipcode) {
        var handleResponse = response => {
            var errorMessage = 'Unknown error.';
            if (response && response.hasOwnProperty('success')) {
                if (response.success === true) {
                    errorMessage = null;
                } else {
                    if (response.hasOwnProperty('message') && typeof response.message === 'string') {
                        errorMessage = response.message;
                    }
                }
            }
            if (errorMessage) {
                this.updateErrorMsg(errorMessage);
            } else {
                this.updateErrorMsg("Updated payment info.", this.state.greenErrorMsgColor);
                this.setupPage({
                    username: this.state.username,
                    token: this.state.token
                });
            }
        };
        axios.post(`${global.config.api_url}/payment`, {
            name: `${name_on_card}`,
            card_number: `${card_number}`,
            expiration: `${expiration}`,
            zipcode: `${zipcode}`
        }, {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            handleResponse(resp_data);
        }).catch(error => {
            if (error) {
                var resp_data = null;
                if (error.response && error.response.data)
                    resp_data = error.response.data;
                handleResponse(resp_data);
            }
        });
    }

    render() {
        return (
            <div style={{ position: 'relative' }}>
                <div className="center rightSide">
                    <div className="formBorder" style={{ marginTop: '50px', marginBottom: '80px' }}>
                        <div className="centerTitle" style={{ marginBottom: '15px' }}>
                            <h1 style={{ fontSize: '2.2em' }}> Payment Method </h1>
                        </div>
                        {/* An area where users can create new project, by providing project name, description, and projectID. */}
                        <Form.Group>
                            <Form.Label style={{ opacity: '1', marginTop: '0.5em', fontSize: '19px' }}>Card Number</Form.Label>
                            <Form.Control type="text" placeholder="****-****-****-****" onChange={this.update_card_number.bind(this)} style={{ opacity: '1', marginBottom: '10px' }} />
                            <Form.Label style={{ marginTop: '0.5em', fontSize: '19px' }}>Name on Card</Form.Label>
                            <Form.Control type="text" placeholder="John Doe" onChange={this.update_name_on_card.bind(this)} style={{ marginBottom: '10px' }} />
                            <Form.Label style={{ marginTop: '0.5em', fontSize: '19px' }}>Expiration Date</Form.Label>
                            <Form.Control type="text" placeholder="04/21" onChange={this.update_expiration.bind(this)} style={{ marginBottom: '10px' }} />
                            <Form.Label style={{ marginTop: '0.5em', fontSize: '19px' }}>Zipcode</Form.Label>
                            <Form.Control type="text" placeholder="94040" onChange={this.update_zipcode.bind(this)} style={{ marginBottom: '10px' }} />
                            <Button variant="outlined" color="default" onClick={this.validateForm.bind(this, true)} style={{ marginTop: '20px' }}> Update Info </Button>
                        </Form.Group>
                        <span style={{ fontStyle: 'italic', fontSize: '14px', marginTop: '25px', display: 'block' }}> Please DO NOT enter real/sensitive details.<br />This site is for PoC purposes only. </span>
                        <span className="errorMessage" style={{ display: (this.state.errorMsg != "" ? 'block' : 'none'), paddingTop: '15px', paddingBottom: '14px', color: (this.state.errorMsgColor) }}>{this.state.errorMsg}</span>
                        <div style={{ marginTop: (this.state.errorMsg == "" ? '32px' : '19px'), marginBottom: '0', fontSize: '15.2px' }}>
                            <span style={{ letterSpacing: '0.4px' }}><b>Default Payment Method:</b>&nbsp;{(this.state.defaultMethod && this.state.defaultMethod != "" && this.state.defaultMethod.trim() != "" ? this.state.defaultMethod : 'None.')}</span>
                        </div>
                    </div>
                </div>
                {/* <div style={{ position: 'absolute', top: '-60px', left: 'calc(14.3vw + 40px)' }}>
                    <Button style={{ padding: '5px 20px', opacity: '0.92' }} color="default" startIcon={<ArrowBackIosIcon />} onClick={this.backButtonClick.bind(this)}>Back</Button>
                </div> */}
            </div >
        );
    }
}

export default withRouter(PaymentForm);