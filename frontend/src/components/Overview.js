
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
            username: "",
            projectList: [],
            totalHW: "0",
            first: false
        };
    }

    componentDidMount() {
        this.parseURL();
        global.api.authenticated((user => {
            if (user === false) this.redirectPage();
            else this.setupPage(user);
        }).bind(this));
    }
    componentWillUnmount() {

    }

    parseURL() {
        let query = new URLSearchParams(this.props.location.search);
        if (query.has('first') && query.get('first') === 'true') {
            this.setState({ first: true });
        }
    }

    redirectPage() {
        this.props.history.push('/');
    }

    setupPage(user) {
        console.log('Overview: loading user ' + user.username);
        // console.log("list is " + user.email);
        axios.get(`${global.config.api_url}/user?username=${user.username}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log('resp_data', resp_data);
            if (resp_data && resp_data.success && resp_data.success === true && resp_data.data && resp_data.data.username && resp_data.data.projectList) {
                var totalCheckedout = 0;
                for (var s in resp_data.data.hw_sets) {
                    totalCheckedout += resp_data.data.hw_sets[s];
                }
                this.setState({
                    username: resp_data.data.username,
                    projectList: resp_data.data.projectList,
                    totalHW: totalCheckedout
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

    render() {
        return (
            <div>
                <div className="center overviewMain">
                    <div className="rightSideAlt">
                        <div className="centerTitle">
                            <h1 style={{ fontSize: '3em', marginBottom: "3.5vh" }}> Welcome{(this.state.first === false ? ' back' : '')} @{this.state.username}</h1>
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
                <Project mainView="false" hideButtons="true"></Project>
                <div className="rightSideAlt projectSpacer">
                    <div className="spacerAlt"></div>
                </div>
                <Hardware mainView="false" ></Hardware>
            </div >

        );
    }
}
export default withRouter(Overview);