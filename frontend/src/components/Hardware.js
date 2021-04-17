
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
            hw1: "",
            hw2: ""
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
        console.log('Hardware: loading user ' + user.username);
        axios.get(`${global.config.api_url}/user?username=${user.username}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log('resp_data', resp_data);
            if (resp_data && resp_data.success && resp_data.success === true && resp_data.data && resp_data.data.username && resp_data.data.projectList) {
                this.setState({
                    hw1: resp_data.data.hwSet1,
                    hw2: resp_data.data.hwSet2
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
            <div className="center overviewMain rightSide" style={{ marginTop: (this.props.mainView == 'true' ? '100px' : '40px') }}>
                <div className="centerTitle" style={{ marginBottom: '33px', textAlign: 'center' }}>
                    <h1> Hardware</h1>
                </div>

                <div className="topPanel">
                    <div className="leftOverview">
                        <div className="stack">
                            <h2> Hardware Set 1 </h2>
                            <div className="overviewCard">
                                <h1 className="top" style={{ fontSize: '1.4em' }}> You have checked out </h1>
                                <h1 className="num"> {this.state.hw1} GB </h1>
                                <h1 className="bottom" style={{ fontSize: '1.9em' }}> of hwSet1 </h1>
                            </div>
                        </div>

                    </div>
                    <div className="rightOverView">
                        <div className="stack">
                            <h2> Hardware Set 2 </h2>
                            <div className="overviewCard">
                                <h1 className="top" style={{ fontSize: '1.4em' }}> You have checked out </h1>
                                <h1 className="num"> {this.state.hw2} GB </h1>
                                <h1 className="bottom" style={{ fontSize: '1.9em' }}> of hwSet2 </h1>
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