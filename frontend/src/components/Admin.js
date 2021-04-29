
import '../global.js'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Project from "../components/Projects";
import Hardware from "../components/Hardware";
import "../styles/admin.css";



class Admin extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            token: "",
            username: "",
            password: "",
            email: "",
            is_admin: false,
            is_godmin: false,
            projectList: [],
            respMsg: "",
            color: ""
        };
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

    updateAdmin(event) {
        console.log(event.target.checked);
        this.setState({
            is_admin: event.target.checked
        });
    }

    updateResponseMsg(value) {
        this.setState({
            respMsg: value
        });
    }

    checkEnter(event) {
        if (event && event.keyCode == 13) {
            this.validateForm(true);
        }
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
        console.log(user);
        axios.get(`${global.config.api_url}/user?username=${user.username}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then((response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log('resp_data', resp_data);
            if (resp_data && resp_data.success && resp_data.success === true && resp_data.data && resp_data.data.is_godmin) {
                console.log(resp_data);
                this.setState({
                    is_godmin: resp_data.data.is_godmin,
                    token: user.token
                });
            } else console.log('Invalid response: ', resp_data);
        }).bind(this)).catch(error => {
            if (error) {
                var resp_data = null;
                if (error.response && error.response.data)
                    resp_data = error.response.data;
                console.log(error);
            }
        });
    }
    validateForm(sendRequest = false) {
        var username = this.state.username;
        var password = this.state.password;
        var email = this.state.email;
        var is_admin = this.state.is_admin;
        var is_godmin = this.state.is_godmin;
        if (username && username.trim().length > 0) {
            if (password && password.trim().length > 0) {
                if (global.util.validateAlphanumeric(username)) {
                    password = global.util.hashPassword(password);
                    if (sendRequest) this.createNewUser(username, email, password, is_admin, is_godmin);
                } else this.updateResponseMsg('Invalid username (letters and numbers only).');
            } else this.updateResponseMsg('Empty password.');
        } else this.updateResponseMsg('Empty username.');
    }
    // create_user(username, email, pwd, project_list, is_admin = False, is_godmin = False):
    createNewUser(username, email, password, is_admin, is_godmin) {
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
                    color: "successMessage"
                });
                console.log("Why am i not getting css right");
            } else {
                // this.redirectPage('admin');
                this.setState({
                    respMsg: response.message,
                    color: "errorMessage"
                });
                console.log("hit this");
            }
        };
        axios.post(`${global.config.api_url}/new_user`, {
            username: `${username}`,
            email: `${email}`,
            password: `${password}`,
            is_admin: is_admin,
            is_godmin: is_godmin
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


    /* TODO: Create User form, create hardware set form  */
    render() {
        const color = this.state.color;
        return (
            <div>
                <div className="center overviewMain">
                    <div className="rightSideAlt">
                        <div className="centerTitle">
                            <h1 style={{ fontSize: '3em', marginBottom: "3.5vh" }}>Admin:  @{this.state.username}</h1>
                        </div>
                        <div className="topPanel">
                            <div className="leftOverview">
                                <div className="overviewCard">
                                    <h1 className="top" style={{ fontSize: '1.5em' }}> You have </h1>
                                    <h1 className="num"> {this.state.projectList.length} </h1>
                                    <h1 className="bottom" style={{ fontSize: '1.9em' }}> projects </h1>
                                </div>
                            </div>
                            <div className="rightOverView">
                                <div className="overviewCard">
                                    <h1 className="top" style={{ fontSize: '1.4em' }}> You have checked out </h1>
                                    <h1 className="num"> {this.state.totalHW} GB </h1>
                                    <h1 className="bottom" style={{ fontSize: '1.9em' }}> of hardware </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rightSide" style={{ marginBottom: '60px', marginTop: '55px' }}>
                    <div className="formCard" style={{ padding: '60px 40px 40px 40px' }}>
                        <div className="formCenter">
                            <div className="centerTitle" style={{ marginBottom: '10px' }}>
                                <h1 style={{ fontSize: '2.2em' }}> Create Admin Users </h1>
                            </div>
                            <Form>
                                <Form.Group controlId="adminUserFrom">
                                    <Form.Group>
                                        <Form.Label style={{ marginTop: '0.5em' }}>Username</Form.Label>
                                        <Form.Control type="text" placeholder="username" style={{ marginBottom: '10px' }} onChange={this.updateUsername.bind(this)} onKeyUp={this.checkEnter.bind(this)} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ marginTop: '0.5em' }}>Email</Form.Label>
                                        <Form.Control type="text" placeholder="test@example.com" style={{ marginBottom: '10px' }} onChange={this.updateEmail.bind(this)} onKeyUp={this.checkEnter.bind(this)} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ marginTop: '0.5em' }}>Password</Form.Label>
                                        <Form.Control type="text" placeholder="password" style={{ marginBottom: '10px' }} onChange={this.updatePassword.bind(this)} onKeyUp={this.checkEnter.bind(this)} />
                                    </Form.Group>
                                    <Form.Group>
                                        {/* <Form.Label style={{ marginTop: '0.5em' }}>Permissions </Form.Label> */}
                                        <Form.Check type="checkbox" label="Is user admin?" disabled={!this.state.is_godmin} onChange={this.updateAdmin.bind(this)} onKeyUp={this.checkEnter.bind(this)} />
                                    </Form.Group>
                                    <Button style={{ marginTop: '20px' }} onClick={this.validateForm.bind(this, true)}> Create user </Button>
                                </Form.Group>
                                <span className={color} style={{ paddingTop: '15px' }}>{this.state.respMsg}</span>
                                {/* <span className="successMessage" style={{ paddingTop: '15px' }}>{this.state.successMsg}</span> */}
                            </Form>
                        </div>
                    </div>
                </div>
                <div className="rightSideAlt projectSpacer">
                    <div className="spacerAlt"></div>
                </div>
                <div className="rightSide" style={{ marginBottom: '60px', marginTop: '55px' }}>
                    <div className="formCard" style={{ padding: '60px 40px 40px 40px' }}>
                        <div className="formCenter">
                            <div className="centerTitle" style={{ marginBottom: '10px' }}>
                                <h1 style={{ fontSize: '2.2em' }}> Create Hardware Set </h1>
                            </div>
                            <Form>
                                <Form.Group controlId="adminUserFrom">
                                    <Form.Group>
                                        <Form.Label style={{ marginTop: '0.5em' }}>Hardware Set ID</Form.Label>
                                        <Form.Control type="text" placeholder="hwSetX" style={{ marginBottom: '10px' }} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ marginTop: '0.5em' }}>Hardware Set Name</Form.Label>
                                        <Form.Control type="text" placeholder="Hardware Set 1" style={{ marginBottom: '10px' }} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ marginTop: '0.5em' }}>Capacity</Form.Label>
                                        <Form.Control type="text" placeholder="512 GB" style={{ marginBottom: '10px' }} />
                                    </Form.Group>

                                    <Button style={{ marginTop: '20px' }}> Create Hardware Set </Button>
                                </Form.Group>
                                <span className={color} style={{ paddingTop: '15px' }}>{this.state.respMsg}</span>
                            </Form>
                        </div>
                    </div>
                </div>
            </div >

        );
    }
}
export default withRouter(Admin);