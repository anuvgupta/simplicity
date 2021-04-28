import '../global.js'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Dock from 'react-dock'
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
                </div>
                <div className="main">
                </div>
            </div>

        );
    }

}