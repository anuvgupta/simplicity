import '../global.js'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Dock from 'react-dock'
import axios from 'axios';
import '../styles/account.css';
import {
    NavLink
} from "react-router-dom";

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: true,
            fluid: true,
            activeBG: 'rgba(1, 1, 1, 0.07)',
            inactiveBG: 'rgba(1, 1, 1, 0)'
        };
    }

    componentDidMount() {
        global.api.authenticated((user => {
            if (user === false) this.redirectPage();
            else this.setupPage(user);
        }).bind(this));
    }
    redirectPage() {
        this.props.history.push('/home');
    }

    setupPage(user) {
        console.log('SideBar: loading user ' + user.username);
        // console.log("list is " + user.email);
        axios.get(`${global.config.api_url}/user?username=${user.username}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log('resp_data', resp_data);
            if (resp_data && resp_data.success && resp_data.success === true && resp_data.data && resp_data.data.hasOwnProperty('is_admin')) {
                // console.log(resp_data);
                this.setState({
                    isVisible: resp_data.data.is_admin,
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
        var active = this.props.active;
        console.log(`SideBar.active: ${active}`);
        return (
            <div>
                <div className="sidenav">
                    <NavLink to="/home" style={{ backgroundColor: (active == 'overview' ? this.state.activeBG : this.state.inactiveBG) }}><img className="profileImg"></img>Home </NavLink>
                    <NavLink to="/projects" style={{ backgroundColor: (active == 'projects' ? this.state.activeBG : this.state.inactiveBG) }}> Projects </NavLink>
                    <NavLink to="/hardware" style={{ backgroundColor: (active == 'hardware' ? this.state.activeBG : this.state.inactiveBG) }}> Hardware </NavLink>
                    <NavLink to="/datasets" style={{ backgroundColor: (active == 'datasets' ? this.state.activeBG : this.state.inactiveBG) }}> Datasets </NavLink>
                    <NavLink to="/admin" style={{ backgroundColor: (active == 'admin' ? this.state.activeBG : this.state.inactiveBG), display: (this.state.isVisible ? "auto" : "none") }}> Admin </NavLink>
                    <NavLink to="/settings" style={{ backgroundColor: (active == 'settings' ? this.state.activeBG : this.state.inactiveBG) }}> Settings </NavLink>
                </div>
                <div className="main">
                </div>
            </div>

        );
    }

}