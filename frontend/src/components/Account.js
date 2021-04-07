import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Dock from 'react-dock'
import '../styles/account.css';

export default class Account extends React.Component {
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
                    <a href="#"><img class="profileImg"></img> Username</a>
                    <a href="#"> My Projects</a>
                    <a href="#"> My HW</a>
                    <a href="#"> My Datasets </a>
                </div>
                <div class="main">
                </div>
            </div>

        );
    }

}