import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Dock from 'react-dock'

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
                <Dock position='left' isVisible={this.state.isVisible} fluid={this.state.fluid}>
                    {/* you can pass a function as a child here */}
                    {/* <div onClick={() => this.setState({ isVisible: !this.state.isVisible })}>X</div> */}
                </Dock>
                <h1> hello world </h1>
            </div>

        );
    }

}