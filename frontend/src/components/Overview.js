
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



class Overview extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: ""
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
        console.log('loading user ' + user.username);
        console.log("list is "+ user.email);
        var handleResponse = response => {
            var errorMessage = 'Unknown error.';
            if (response && response.hasOwnProperty('success')) {
                if (response.success === true) {
                    if (response.hasOwnProperty('data')) {
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
            } else {
                console.log("here");
            }
        };
        axios.post(`${global.config.api_url}/user`, {
            username: `${user.username}`,
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            console.log(resp_data);
        }).catch(error => {
            if (error) {
                var resp_data = null;
                if (error.response && error.response.data)
                    resp_data = error.response.data;
                handleResponse(resp_data);
            }
        });
        // this.state.username = user.username;
        // this.state.projectIds = user.projectList;
        // TODO: load user data/info
    }

    updateUsername(event) {
        this.setState({
            username: event.target.value
        });
    }

    render() {
        return (
            <div>
                <div className="center">
                    <div className="rightSide">
                        <div className="centerTitle">
                            <h1> Welcome back User</h1>
                        </div>
                        <div className="topPanel">
                            <div className="leftOverview">
                                <div className="overviewCard">
                                    <h1>You have X projects</h1>
                                </div>
                            </div>
                            <div className="rightOverView">
                                <div className="overviewCard">
                                    <h1> You have checked out X hardware</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Project></Project>
                <div className="rightSide spacer">

                </div>
                <Hardware></Hardware>
            </div>

        );
    }
}
export default withRouter(Overview);