
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
            hwUsageList: {},
            projectHWUsageList: {},
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
        axios.get(`${global.config.api_url}/user?username=${user.username}&projectHWusage=true`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log('resp_data', resp_data);
            if (resp_data && resp_data.success && resp_data.success === true && resp_data.data && resp_data.data.username && resp_data.data.projectList) {
                this.setState({
                    username: resp_data.data.username,
                    projectList: resp_data.data.projectList,
                    hwUsageList: resp_data.data.hw_sets ? resp_data.data.hw_sets : {},
                    projectHWUsageList: resp_data.data.proj_hw_usage ? resp_data.data.proj_hw_usage : {}
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

    getTotalHardwareUsage() {
        var shared_usage = 0;
        var personal_usage = 0;
        for (var hardware_set_id in this.state.hwUsageList) {
            personal_usage += this.state.hwUsageList.hasOwnProperty(`${hardware_set_id}`) ? this.state.hwUsageList[hardware_set_id] : 0;
        }
        for (var hardware_set_id in this.state.projectHWUsageList) {
            shared_usage += this.state.projectHWUsageList.hasOwnProperty(`${hardware_set_id}`) ? this.state.projectHWUsageList[hardware_set_id] : 0;
        }
        return [(shared_usage + personal_usage), personal_usage, shared_usage];
    }

    render() {
        let hw_usage = this.getTotalHardwareUsage();
        let cardDivWidth = 855;
        return (
            <div>
                <div className="center overviewMain">
                    <div className="rightSideAlt">
                        <div className="centerTitle">
                            <h1 style={{ fontSize: '3em', marginBottom: "50px" }}> Welcome{(this.state.first === false ? ' back' : '')} @{this.state.username}</h1>
                        </div>
                        <div style={{ width: '100%', maxWidth: `${cardDivWidth}px`, margin: '0 auto' }}>
                            <div className="topPanel" style={{ maxWidth: `${cardDivWidth}px`, float: 'left' }}>
                                <div className="hwLeftOverview" style={{ marginRight: '15px' }}>
                                    <div className="overviewCard">
                                        <h1 className="top" style={{ fontSize: '1.5em', marginTop: '7px' }}> You have </h1>
                                        <h1 className="num"> {this.state.projectList.length} </h1>
                                        <h1 className="bottom" style={{ fontSize: '1.9em' }}> project{this.state.projectList.length == 1 ? '' : 's'} </h1>
                                    </div>
                                </div>
                                <div className="hwRightOverview" style={{ marginLeft: '15px' }}>
                                    <div className="overviewCard">
                                        <h1 className="top" style={{ fontSize: '1.4em', marginTop: '4px', marginBottom: '12.5px' }}> Hardware checked out </h1>
                                        <h1 className="num"> {hw_usage[0]} GB </h1>
                                        <h1 className="bottom" style={{ fontSize: '1.4em', color: '#333', marginTop: '15px', marginBottom: '5px' }}> {hw_usage[1]} GB Personal &nbsp;/&nbsp; {hw_usage[2]} GB Shared </h1>
                                    </div>
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