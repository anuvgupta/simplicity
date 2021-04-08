
import '../global.js'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import Project from "../components/Projects";
import Hardware from "../components/Hardware";
import "../styles/overview.css";



class Overview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
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

    requestSignIn() {
        var username = this.state.username;
        var password = this.state.password;
        if (username && password && username.trim().length > 0 && password.trim().length > 0) {
            console.log(username, password);
        }
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
export default Overview;