
import '../global.js'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Row } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
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
            numUsers: "",
            password: "",
            email: "",
            is_admin: false,
            is_godmin: false,
            projectList: [],
            hw_sets: {},
            usedHw: "",
            respMsg: "",
            hwRespMsg: "",
            h_id: "",
            h_name: "",
            h_capacity: 512,
            h_price: 1,
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

    updateResponseMsg(value, isUserForm) {
        if (isUserForm) {
            this.setState({
                respMsg: value
            });
        } else {
            this.setState({
                hwRespMsg: value
            });
        }

    }
    updateH_ID(event) {
        console.log(event.target.value);
        this.setState({
            h_id: event.target.value
        });
    }
    updateHName(event) {
        this.setState({
            h_name: event.target.value
        });
    }
    updateHCapacity(event) {
        this.setState({
            h_capacity: event.target.value
        });
    }
    updateHPrice(event) {
        var updateVal = 1.0;
        try {
            updateVal = parseFloat(`${event.target.value}`);
        } catch (e) {
            return;
        }
        this.setState({
            h_price: updateVal
        });
    }

    checkEnter(event) {
        if (event && event.keyCode == 13) {
            this.validateForm(true);
        }
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
    getAdminStats() {
        console.log("test");
    }

    setupPage(user) {
        // console.log(user);
        axios.get(`${global.config.api_url}/user?username=${user.username}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then((response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log('resp_data', resp_data);
            if (resp_data && resp_data.success && resp_data.success === true && resp_data.data) {
                // console.log(resp_data);
                // var adminStats = this.getAdminStats();
                this.setState({
                    is_godmin: resp_data.data.is_godmin,
                    token: user.token,
                    projectList: resp_data.data.projectList,
                    hwSet: resp_data.data.hw_sets
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
        this.getUserInfo(user.token, ((resp, error = null) => {
            if (resp) {
                // console.log(resp.data);
                this.setState({
                    numUsers: resp.data
                });
            } else {
                console.log(error);
            }
        }).bind(this));
        this.getHardwareInfo(user.token, ((resp, error = null) => {
            if (resp) {
                // console.log(resp.data);
                var checkoutAmount = 0;
                for (let entry in resp.data) {
                    // console.log(resp.data[entry].capacity);
                    checkoutAmount += resp.data[entry].capacity - resp.data[entry].available;
                }
                this.setState({
                    hw_sets: resp.data,
                    usedHw: checkoutAmount
                });

            } else {
                console.log(error);
            }
        }).bind(this));
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
                    if (sendRequest) {
                        this.createNewUser(username, email, password, is_admin, is_godmin, (_ => {
                            global.api.authenticate((user => {
                                if (user === false) this.redirectPage();
                                else this.setupPage(user);
                            }).bind(this));
                        }).bind(this));
                    }
                } else this.updateResponseMsg('Invalid username (letters and numbers only).', true);
            } else this.updateResponseMsg('Empty password.', true);
        } else this.updateResponseMsg('Empty username.', true);
    }
    // create_user(username, email, pwd, project_list, is_admin = False, is_godmin = False):
    createNewUser(username, email, password, is_admin, is_godmin, resolve = null) {
        var handleResponse = (response => {
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
            if (resolve) resolve();
        }).bind(this);
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

    validateHForm(sendRequest = false) {
        var hw_id = this.state.h_id;
        var hw_name = this.state.h_name;
        var hw_capacity = this.state.h_capacity;
        var hw_price = this.state.h_price;
        if (hw_id && hw_id.trim().length > 0) {
            if (hw_name && hw_name.trim().length > 0) {
                if (global.util.validateAlphanumeric(hw_id)) {
                    if (sendRequest) {
                        this.createNewHwSet(hw_id, hw_name, hw_capacity, hw_price, (_ => {
                            global.api.authenticate((user => {
                                if (user === false) this.redirectPage();
                                else this.setupPage(user);
                            }).bind(this));
                        }).bind(this));
                    }
                } else this.updateResponseMsg('Invalid hardware set ID (letters and numbers only).', false);
            } else this.updateResponseMsg('Empty hardware set name', false);
        } else this.updateResponseMsg('Empty hardware set ID.', false);
    }

    createNewHwSet(hw_id, hw_name, hw_capacity, hw_price, resolve = null) {
        // console.log(hw_id, hw_name, hw_capacity);
        var handleResponse = (response => {
            var rMsg = "";
            var color = "";
            if (response && response.hasOwnProperty('success')) {
                if (response.success == true) {
                    rMsg = "Hardware Set created successfully";
                    color = "successMessage";
                    // console.log("we need to put a success message here")
                } else {
                    rMsg = response.message;
                    color = "red";
                }
            }
            if (color == "successMessage") {
                this.setState({
                    hwRespMsg: rMsg,
                    color: "successMessage"
                });
            } else {
                // this.redirectPage('admin');
                this.setState({
                    hwRespMsg: response.message,
                    color: "errorMessage"
                });
            }
            if (resolve) resolve();
        }).bind(this);
        axios.post(`${global.config.api_url}/createHW`, {
            id: `${hw_id}`,
            name: `${hw_name}`,
            capacity: hw_capacity,
            price: hw_price
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

    getUserInfo(token, resolve) {
        axios.post(`${global.config.api_url}/getNumUsers`, {},
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


    /* TODO: Create User form, create hardware set form  */
    render() {
        const color = this.state.color;
        return (
            <div>
                <div className="center overviewMain">
                    <div className="rightSideAlt">
                        <div className="centerTitle" style={{ marginBottom: "3.5vh" }}>
                            <h1 style={{ fontSize: '3em', marginBottom: '2px' }}> Admin </h1>
                            <h6 style={{ display: (this.state.is_godmin ? 'block' : 'none'), color: '#444', marginBottom: '3px', fontStyle: 'italic', fontSize: '18px' }}> Godmin </h6>
                        </div>
                        <div className="topPanel">

                            <div className="centerCard overviewCard">
                                <h1 className="top" style={{ fontSize: '1.5em' }}> <span className="adminItem">{this.state.numUsers}</span> User{(this.state.numUsers == 1 ? '' : 's')} </h1>
                                <h1 className="top" style={{ fontSize: '1.5em' }}> <span className="adminItem">{this.state.projectList.length} </span> Project{(this.state.projectList.length == 1 ? '' : 's')} </h1>
                                <h1 className="top" style={{ fontSize: '1.5em' }}> <span className="adminItem">{Object.keys(this.state.hw_sets).length}</span> Hardware Set{(Object.keys(this.state.hw_sets).length == 1 ? '' : 's')} </h1>
                                <h1 className="top" style={{ fontSize: '1.5em' }}> <span className="adminItem">{this.state.usedHw} GB</span> checked out </h1>

                            </div>


                        </div>
                    </div>
                </div>
                <div className="rightSide" style={{ marginBottom: '60px', marginTop: '55px' }}>
                    <div className="formCard" style={{ padding: '60px 40px 40px 40px' }}>
                        <div className="formCenter">
                            <div className="centerTitle" style={{ marginBottom: '23px' }}>
                                <h1 style={{ fontSize: '2.2em' }}> Create User </h1>
                            </div>
                            <Form.Group controlId="adminUserFrom">
                                <Form.Group>
                                    <Form.Label style={{ marginTop: '0.5em', fontSize: '19px' }}>Username</Form.Label>
                                    <Form.Control type="text" placeholder="username" style={{ marginBottom: '10px' }} onChange={this.updateUsername.bind(this)} onKeyUp={this.checkEnter.bind(this)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label style={{ marginTop: '0.5em', fontSize: '19px' }}>Email</Form.Label>
                                    <Form.Control type="text" placeholder="name@email.com" style={{ marginBottom: '10px' }} onChange={this.updateEmail.bind(this)} onKeyUp={this.checkEnter.bind(this)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label style={{ marginTop: '0.5em', fontSize: '19px' }}>Password</Form.Label>
                                    <Form.Control type="password" placeholder="********" style={{ marginBottom: '10px' }} onChange={this.updatePassword.bind(this)} onKeyUp={this.checkEnter.bind(this)} />
                                </Form.Group>
                                <Form.Group style={{ marginTop: '25px' }}>
                                    {/* <Form.Label style={{ marginTop: '0.5em' }}>Permissions </Form.Label> */}
                                    <Form.Check type="checkbox" label="&nbsp;Administrator Status" disabled={!this.state.is_godmin} onChange={this.updateAdmin.bind(this)} onKeyUp={this.checkEnter.bind(this)} />
                                </Form.Group>
                                <Button variant="outlined" color="default" style={{ marginTop: '20px' }} onClick={this.validateForm.bind(this, true)}> Create user </Button>
                            </Form.Group>
                            <span className={color} style={{ paddingTop: '15px' }}>{this.state.respMsg}</span>
                            {/* <span className="successMessage" style={{ paddingTop: '15px' }}>{this.state.successMsg}</span> */}
                        </div>
                    </div>
                </div>
                <div className="rightSideAlt projectSpacer">
                    <div className="spacerAlt"></div>
                </div>
                <div className="rightSide" style={{ marginBottom: '60px', marginTop: '55px' }}>
                    <div className="formCard" style={{ padding: '60px 40px 40px 40px' }}>
                        <div className="formCenter">
                            <div className="centerTitle" style={{ marginBottom: '23px' }}>
                                <h1 style={{ fontSize: '2.2em' }}> Create Hardware Set </h1>
                            </div>
                            <Form.Group controlId="hwSetForm">
                                <Form.Group>
                                    <Form.Label style={{ marginTop: '0.5em', fontSize: '19px' }}> Hardware Set ID </Form.Label>
                                    <Form.Control type="text" placeholder="hwSetX" style={{ marginBottom: '10px' }} onChange={this.updateH_ID.bind(this)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label style={{ marginTop: '0.5em', fontSize: '19px' }}> Hardware Set Name </Form.Label>
                                    <Form.Control type="text" placeholder="Hardware Set X" style={{ marginBottom: '10px' }} onChange={this.updateHName.bind(this)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label style={{ marginTop: '0.5em', fontSize: '19px' }}> Capacity (GB) </Form.Label>
                                    <Form.Control type="text" placeholder="512" style={{ marginBottom: '10px' }} onChange={this.updateHCapacity.bind(this)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label style={{ marginTop: '0.5em', fontSize: '19px' }}> Pricing ($/GB) </Form.Label>
                                    <Form.Control type="text" placeholder="4.35" style={{ marginBottom: '10px' }} onChange={this.updateHPrice.bind(this)} />
                                </Form.Group>

                                <Button variant="outlined" color="default" style={{ marginTop: '20px' }} onClick={this.validateHForm.bind(this, true)}> Create Hardware Set </Button>
                            </Form.Group>
                            <span className={color} style={{ paddingTop: '15px' }}>{this.state.hwRespMsg}</span>
                        </div>
                    </div>
                </div>
            </div >

        );
    }
}
export default withRouter(Admin);