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

        };
    }

    render() {
        return (
            <div>
                <div class="sidenav">
                    <NavLink to="/account"><img className="profileImg"></img>Overview </NavLink>
                    <NavLink to="/project">Projects </NavLink>
                    <NavLink to="/hardware">Hardware </NavLink>
                    <NavLink to="/datasets">Datasets </NavLink>
                </div>
                <div class="main">
                </div>
            </div>

        );
    }

}