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
                    <a href="/Account"><img class="profileImg"></img> Overview</a>
                    <a href="/project"> My Projects</a>
                    <a href="/hardware"> My HW</a>
                    <a href="/datasets"> My Datasets </a>
                </div>
                <div class="main">
                </div>
            </div>

        );
    }

}