// Register page


import axios from 'axios';
import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import '../global.js';
import '../styles/loginpage.css';


class RegisterPage extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            errorMsg: ""
        };
    }

    componentDidMount() {
        global.api.authenticated(is_authenticated => {
            if (is_authenticated) this.redirectPage();
        });
    }
    componentWillUnmount() {

    }

    updateUsername(event) {
        this.setState({
            username: event.target.value
        });
    }

    updateEmail(event) {
        this.setState({
            email: event.target.value
        });
    }

    updatePassword(event) {
        this.setState({
            password: event.target.value
        });
    }

    updateErrorMsg(value) {
        this.setState({
            errorMsg: value
        });
    }

    validateForm(sendRequest = false) {
        var username = this.state.username;
        var email = this.state.email;
        var password = this.state.password;
        if (username && username.trim().length > 0) {
            if (email && email.trim().length > 0) {
                if (password && password.trim().length > 0) {
                    if (global.util.validateAlphanumeric(username)) {
                        password = global.util.hashPassword(password);
                        if (sendRequest) this.requestSignUp(username, email, password);
                    } else this.updateErrorMsg('Invalid username (letters and numbers only).');
                } else this.updateErrorMsg('Empty password.');
            } else this.updateErrorMsg('Empty email.');

        } else this.updateErrorMsg('Empty username.');
    }

    checkEnter(event) {
        if (event && event.keyCode == 13) {
            this.validateForm(true);
        }
    }

    redirectPage(force = false) {
        if (!force) {
            this.props.history.push('/home');
        } else {
            window.location = String(`${window.location.origin}/home?first=true`);
        }
    }

    requestSignUp(username, email, password) {
        var handleResponse = response => {
            var accessToken = null;
            var errorMessage = 'Unknown error.';
            if (response && response.hasOwnProperty('success')) {
                if (response.success === true) {
                    if (response.hasOwnProperty('data') && response.data.hasOwnProperty('token') && typeof response.data.token === 'string') {
                        accessToken = response.data.token;
                        errorMessage = null;
                    }
                } else {
                    if (response.hasOwnProperty('message') && typeof response.message === 'string') {
                        errorMessage = response.message;
                    }
                }
            }
            if (errorMessage) {
                this.setState({
                    errorMsg: errorMessage
                });
            } else if (accessToken) {
                global.api.login(accessToken, false);
                this.redirectPage(true);
            }
        };
        axios.post(`${global.config.api_url}/register`, {
            username: `${username}`,
            email: `${email}`,
            password: `${password}`
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            console.log(resp_data);
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
            <div className="center h100">
                <div className="centerTitle">
                    <h1 className="loginTitle titleFont">Sign Up</h1>
                </div>
                <form style={{ marginTop: '7px' }}>
                    Username: <input type="text" id="username" placeholder="username" onChange={this.updateUsername.bind(this)} onKeyUp={this.checkEnter.bind(this)}></input><br />
                    Email: <input type="email" id="email" placeholder="name@email.com" onChange={this.updateEmail.bind(this)} onKeyUp={this.checkEnter.bind(this)}></input><br />
                    Password: <input type="password" id="password" placeholder="********" onChange={this.updatePassword.bind(this)} onKeyUp={this.checkEnter.bind(this)}></input><br />
                    <Button variant="outlined" color="default" style={{ marginTop: '12px' }} onClick={this.validateForm.bind(this, true)}> Sign Up </Button>
                </form>
                <span className="errorMessage">{this.state.errorMsg}</span>
            </div>
        );
    }
}

export default withRouter(RegisterPage);