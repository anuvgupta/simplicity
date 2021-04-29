// Settings page


import axios from 'axios';
import React from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';

import '../global.js';
import '../styles/settingspage.css';


class SettingsPage extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            is_admin: "",
            navColor: "",
            token: "",
            displayColorPicker: false,
            color: "#010101",
            msgColor: "",
            respMsg: ""
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
        this.props.history.push('/');
    }

    setupPage(user) {
        console.log('Settings: loading user ' + user.username);
        // console.log("list is " + user.email);
        axios.get(`${global.config.api_url}/user?username=${user.username}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log('resp_data', resp_data);
            if (resp_data && resp_data.success && resp_data.success === true && resp_data.data && resp_data.data.username) {
                console.log('Settings: setup user', user);
                var color = resp_data.data.navColor;
                console.log(color);
                if (color === null || color == "") {
                    color = "#010101";
                    console.log("color is null");
                }
                // TODO: setup settings with user
                this.setState({
                    username: resp_data.data.username,
                    password: resp_data.data.password,
                    token: user.token,
                    is_admin: resp_data.data.is_admin,
                    color: color
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

    updateResponseMsg(value) {
        this.setState({
            respMsg: value
        });
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

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
        // window.location.reload();
    };

    handleChange = (color) => {
        console.log(color.hex);
        this.setState({ color: color.hex })
        axios.post(`${global.config.api_url}/setUserTheme`, {
            color: `${color.hex}`,
        }, {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            console.log("color changed successfully");
        }).catch(error => {
            if (error) {
                var resp_data = null;
                if (error.response && error.response.data)
                    resp_data = error.response.data;
                console.log("Error: " + resp_data);
            }
        });
        var nav = document.querySelector("header");
        nav.setAttribute("style", "background-color: " + color.hex + ";");
    };

    validateForm(sendRequest = false) {
        var username = this.state.username;
        var password = this.state.password;
        var email = this.state.email;
        var is_admin = this.state.is_admin;
        if (username && username.trim().length > 0) {
            if (password && password.trim().length > 0) {
                if (global.util.validateAlphanumeric(username)) {
                    password = global.util.hashPassword(password);
                    if (sendRequest) {
                        this.updateUser(username, email, password, is_admin);
                    }
                } else this.updateResponseMsg('Invalid username (letters and numbers only).', true);
            } else this.updateResponseMsg('Empty password.', true);
        } else this.updateResponseMsg('Empty username.', true);
    }

    updateUser(username, email, password, is_admin) {
        var handleResponse = response => {
            var rMsg = "";
            var color = "";
            if (response && response.hasOwnProperty('success')) {
                if (response.success == true) {
                    rMsg = "User created successfully";
                    color = "successMessage";
                    // console.log("we need to put a success message here")
                } else {
                    rMsg = response.message;
                    color = "red";
                }
            }
            if (color == "successMessage") {
                this.setState({
                    respMsg: rMsg,
                    msgColor: "successMessage"
                });
                console.log("Why am i not getting css right");
            } else {
                // this.redirectPage('admin');
                this.setState({
                    respMsg: response.message,
                    msgColor: "errorMessage"
                });
                console.log("hit this");
            }
        };
        axios.post(`${global.config.api_url}/update_user`, {
            username: `${username}`,
            email: `${email}`,
            password: `${password}`,
            is_admin: is_admin
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
        const styles = reactCSS({
            'default': {
                color: {
                    width: "100%",
                    height: "100%",
                    borderRadius: '2px',
                    background: `${this.state.color}`,
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    cursor: 'pointer',
                    height: '75%',
                    display: 'block',
                    marginTop: '5px',
                    marginBottom: 'auto'
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });
        return (
            <div>
                <div className="center overviewMain borderNone">
                    <div className="center">
                        <h1>Settings</h1>
                    </div>

                </div>
                <div className="overviewMain borderNone marginTopSmaller centerWidth60">
                    <Form>
                        <Form.Group as={Row} controlId="formSettings">
                            <Form.Label column sm={2}>
                                Username
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="text" placeholder="username" defaultValue={this.state.username} onChange={this.updateUsername.bind(this)} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formHorizontalPassword">
                            <Form.Label column sm={2}>
                                Password
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="password" placeholder="********" onChange={this.updatePassword.bind(this)} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formHorizontalCheck">
                            <Col sm={{ span: 6 }}>
                                <Form.Check label="&nbsp;Admin" disabled checked={this.state.is_admin} />
                            </Col>
                            <Col sm={{ span: 2, offset: 4 }}>
                                <Button type="submit" onClick={this.validateForm.bind(this, true)}>Update Info</Button>
                            </Col>
                        </Form.Group>
                        <span className={this.state.msgColor} style={{ paddingTop: '15px' }}>{this.state.respMsg}</span>

                        <Form.Group as={Row}>
                            <Form.Label column sm={2}>
                                Theme
                            </Form.Label>
                            <Col sm={10}>

                                <div style={styles.swatch} onClick={this.handleClick}>
                                    <div style={styles.color} />
                                </div>
                                {this.state.displayColorPicker ?
                                    <div style={styles.popover}>
                                        <div style={styles.cover} onClick={this.handleClose} />
                                        <SketchPicker color={this.state.color} onChange={this.handleChange} />
                                    </div>
                                    : null}
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        );
    }
}

export default withRouter(SettingsPage);