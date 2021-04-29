// Settings page


import axios from 'axios';
import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import '../global.js';
import '../styles/settingspage.css';


class SettingsPage extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {

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
        this.props.history.push('/');
    }

    setupPage(user) {
        console.log('Settings: loading user ' + user.username);
        // console.log("list is " + user.email);
        axios.get(`${global.config.api_url}/user?username=${user.username}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log('resp_data', resp_data);
            if (resp_data && resp_data.success && resp_data.success === true && resp_data.data && resp_data.data.username) {
                console.log('Settings: setup user', user);
                // TODO: setup settings with user
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
            <div className="center h100">
                <div className="centerTitle">
                    <h1>Settings</h1>
                </div>
            </div>
        );
    }
}

export default withRouter(SettingsPage);