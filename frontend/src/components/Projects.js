import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Container } from 'react-bootstrap';
import axios from 'axios'
import '../styles/project.css'


class Projects extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    componentDidMount() {

    }
    componentWillUnmount() {

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
            <div className="">

                <div className="centerTitle">
                    <h1> My Projects </h1>
                </div>
                {/* An area where users can create new project, by providing project name, description, and projectID. */}
                <Container fluid className="rightSide test"> 

                </Container>


            </div>
        );
    }
}

export default Projects;