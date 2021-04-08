// login page


import axios from 'axios';
import bcryptjs from 'bcryptjs';
import React from 'react';
import { Button } from 'react-bootstrap';
import { withouter, withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import '../global.js';
import '../styles/loginpage.css';


class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            errorMsg: ""
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

    validateAlphanumeric(value) {
        var alphaNumerics = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var v in value) {
            if (!alphaNumerics.includes(value[v])) {
                return false;
            }
        }
        return true;
    }

    hashPassword(value) {
        const hashSalt = bcryptjs.genSaltSync();
        const hashPassword = bcryptjs.hashSync(value, hashSalt);
        return hashPassword;
    }

    updateErrorMsg(value) {
        this.setState({
            errorMsg: value
        });
    }

    validateForm(sendRequest = false) {
        var username = this.state.username;
        var password = this.state.password;
        if (username && username.trim().length > 0) {
            if (password && password.trim().length > 0) {
                if (this.validateAlphanumeric(username)) {
                    password = this.hashPassword(password);
                    if (sendRequest) this.requestSignIn(username, password);
                } else this.updateErrorMsg('Invalid username (letters and numbers only).');
            } else this.updateErrorMsg('Empty password.');
        } else this.updateErrorMsg('Empty username.');
    }

    redirectPage() {
        this.props.router.push('/account');
    }

    requestSignIn(username, password) {
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
                global.util.cookie('token', accessToken);
                this.redirectPage();
            }
        };
        axios.post(`${global.config.api_url}/login`, {
            username: `${username}`,
            password: `${password}`
        }).then(response => {
            console.log(response);
        }).catch(error => {
            var resp_data = null;
            if (error && error.response && error.response.data) {
                resp_data = error.response.data;
            }
            handleResponse(resp_data);
        });
    }

    render() {
        return (
            <div className="center">
                <div className="centerTitle">
                    <h1 className="loginTitle">Sign In</h1>
                </div>
                <form>
                    Username: <input type="text" id="username" placeholder="username" onChange={this.updateUsername.bind(this)}></input><br />
                    Password: <input type="password" id="password" placeholder="password" onChange={this.updatePassword.bind(this)}></input><br />
                    <Button style={{ marginTop: '8px' }} onClick={this.validateForm.bind(this, true)}> Sign In </Button>
                </form>
                <span className="errorMessage">{this.state.errorMsg}</span>
            </div>
        );
    }
}

export default withRouter(LoginPage);