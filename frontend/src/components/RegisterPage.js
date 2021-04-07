import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import axios from 'axios'


class RegisterPage extends React.Component {

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

    requestSignUp() {
        var username = this.state.username;
        var password = this.state.password;
        if (username && password && username.trim().length > 0 && password.trim().length > 0) {
            console.log(username, password);
        }
    }

    render() {
        return (
            <div className="center">
                <div className="centerTitle">
                    <h1>Register</h1>
                </div>
                <form>
                    Username: <input type="text" id="username" placeholder="username" onChange={this.updateUsername.bind(this)}></input><br />
                    Password: <input type="password" id="password" placeholder="password" onChange={this.updatePassword.bind(this)}></input><br />
                    <Button onClick={this.requestSignUp.bind(this)}> Sign Up </Button>
                </form>
            </div>
        );
    }
}

export default RegisterPage;