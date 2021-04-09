import '../global.js'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Row } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import "../styles/navbar.css";


function NavigationBar(props) {
    return <AppBar position="fixed" id="navbar">
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
    </AppBar>;
}

export default NavigationBar;