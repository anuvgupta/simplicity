import '../global.js'
import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Row } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

import "../styles/navbar.css";

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            color: "#010101",
        };
    }

    componentDidMount() {
        global.api.authenticated((user => {
            if (user === false) this.redirectPage();
            else this.setupPage(user);
        }).bind(this));
    }

    redirectPage() {
        window.location = String(`${window.location.origin}/`);
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
                // console.log('Settings: setup user', user);
                var color = resp_data.data.navColor;
                // console.log(color);
                if (color === null || color == "") {
                    color = "#010101";
                    console.log("color is null");
                }
                // TODO: setup settings with user
                this.setState({
                    color: color
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
            <AppBar position="fixed" id="navbar" style={{ backgroundColor: this.state.color, color: 'white' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" style={{ marginRight: '8px' }}>
                        <Avatar alt="Logo" src={`${global.config.home_url}/img/board_tt.png`} />
                    </IconButton>
                    <Typography variant="h6" style={{ transform: 'scale(1.02)' }}>
                        Simplicity Cloud
                    </Typography>
                    <Button variant="contained" color="default" id="logoutButton" onClick={global.api.logout} >
                        {/* <NavLink to="/music" className="menu_link">Music</NavLink> */}
                        Sign Out
                    </Button>
                </Toolbar>
            </AppBar>
        );
    }

}

export default NavigationBar;