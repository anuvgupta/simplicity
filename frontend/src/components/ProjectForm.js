
import '../global.js'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios'
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import '../styles/project.css'


class ProjectForm extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    componentDidMount() {
        global.api.authenticated((user => {
            if (user === false) this.redirectPage();
            else this.setupPage(user);
        }).bind(this));
    }
    componentWillUnmount() {

    }

    redirectPage() {
        this.props.history.push('/home');
    }

    setupPage(user) {
        console.log('ProjectForm: loading user ' + user.username);
        // TODO: load user data/info
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
        const action = this.props.action;
        const action_title = (`${action[0]}`).toUpperCase() + (`${action.substring(1)}`);
        const create = action == 'create';
        return (
            <div className="center">
                <div className="formBorder">
                    <div className="centerTitle">
                        <h1> {action_title} Project </h1>
                    </div>
                    {/* An area where users can create new project, by providing project name, description, and projectID. */}
                    <Form>
                        <Form.Group controlId="projectName">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control type="text" placeholder="Test Project" />
                            <Form.Label>Project ID</Form.Label>
                            <Form.Control disabled={!create} style={{ opacity: (create ? '1' : '0.6') }} type="text" placeholder="testProject1" />
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" as="textarea" placeholder="Lorem ipsum dolor sit amet..." rows={3} />
                            <Button style={{ marginTop: '25px' }}>{action_title}</Button>
                        </Form.Group>
                    </Form>

                </div>
            </div>
        );
    }
}

export default withRouter(ProjectForm);