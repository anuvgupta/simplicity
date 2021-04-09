
import '../global.js'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import "../styles/hardware.css";
import HardwareForm from "../components/HardwareForm";



class Hardware extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    componentDidMount() {
        global.api.authenticated((user => {
            if (user === false) this.redirectPage();
            else this.setupPage(user.username);
        }).bind(this));
    }
    componentWillUnmount() {

    }

    redirectPage() {
        this.props.history.push('/home');
    }

    setupPage(username) {
        console.log('Hardware: loading user ' + username);
        // TODO: load user data/info
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
            <div className="rightSide">
                <div className="centerTitle">
                    <h1> My Hardware</h1>
                </div>
                <div className="">
                    <div className="hardwareTop">
                        <div className="leftOverview stack">
                            <h1> Hw Set 1 overview </h1>
                            <div className="overviewCard">
                                <h1> You have checked out X hardware</h1>
                            </div>
                        </div>
                        <div className="rightOverView stack">
                            <h1> Hw Set 2 overview </h1>
                            <div className="overviewCard">
                                <h1> You have checked out X hardware</h1>
                            </div>
                        </div>
                    </div>


                </div>
                {/* <Hardware></Hardware> */}

            </div>

        );
    }
}
export default withRouter(Hardware);