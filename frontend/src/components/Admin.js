
import '../global.js'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Project from "../components/Projects";
import Hardware from "../components/Hardware";
import "../styles/overview.css";



class Admin extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            projectList: [],
            totalHW: "0",
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
        console.log('Overview: loading user ' + user.username);
        // console.log("list is " + user.email);
        axios.get(`${global.config.api_url}/user?username=${user.username}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then((response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log('resp_data', resp_data);
            if (resp_data && resp_data.success && resp_data.success === true && resp_data.data && resp_data.data.username && resp_data.data.projectList && resp_data.data.hasOwnProperty('is_admin')) {
                // this.setState({
                //     username: resp_data.data.username,
                //     projectList: resp_data.data.projectList,
                //     totalHW: totalCheckedout
                // });
                if (resp_data.data.is_admin === false) {
                    this.redirectPage();
                }
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
    /* TODO: Create User form, create hardware set form  */
    render() {
        const action = this.props.action;
        // const action_title = (`${action[0]}`).toUpperCase() + (`${action.substring(1)}`);
        const create = action == 'create';
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
                                        <Form.Control type="text" placeholder="username" style={{ marginBottom: '10px' }} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ marginTop: '0.5em' }}>Email</Form.Label>
                                        <Form.Control type="text" placeholder="test@example.com" style={{ marginBottom: '10px' }} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ marginTop: '0.5em' }}>Password</Form.Label>
                                        <Form.Control type="text" placeholder="password" style={{ marginBottom: '10px' }} />
                                    </Form.Group>
                                    <Form.Group>
                                        {/* <Form.Label style={{ marginTop: '0.5em' }}>Permissions </Form.Label> */}
                                        <Form.Check type="checkbox" label="Is user admin?" />
                                    </Form.Group>
                                    <Button style={{ marginTop: '20px' }}> Create user </Button>
                                </Form.Group>
                                <span className="errorMessage" style={{ paddingTop: '15px' }}>{this.state.errorMsg}</span>
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
                                <span className="errorMessage" style={{ paddingTop: '15px' }}>{this.state.errorMsg}</span>
                            </Form>
                        </div>
                    </div>
                </div>
            </div >

        );
    }
}
export default withRouter(Admin);