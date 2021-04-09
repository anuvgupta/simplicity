
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
        console.log("list is " + user.email);
        axios.post(`${global.config.api_url}/user`, {
            username: `${user.username}`,
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            console.log(resp_data);
            this.setState({
                username: resp_data.username,
                projectList: resp_data.projectList
            })
        }).catch(error => {
            if (error) {
                var resp_data = null;
                if (error.response && error.response.data)
                    resp_data = error.response.data;
                console.log(resp_data);
            }
        });
    }

    updateUsername(event) {
        this.setState({
            username: event.target.value
        });
    }

    render() {
        console.log(this.state.numProjects);
        return (
            <div>
                <div className="center">
                    <div className="rightSide">
                        <div className="centerTitle">
                            <h1> Welcome back @{this.state.username}</h1>
                        </div>
                        <div className="topPanel">
                            <div className="leftOverview">
                                <div className="overviewCard">
                                    <h1>You have </h1>
                                    <h1 className="num"> {this.state.projectList.length} </h1>
                                    <h1>projects</h1>
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