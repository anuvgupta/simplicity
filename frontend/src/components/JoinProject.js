
import '../global.js'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios'
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import '../styles/project.css'


class JoinProject extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            msg: "",
            token: "",
            color: "",
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

    redirectPage(page = 'home') {
        this.props.history.push(`/${page}`);
    }

    setupPage(user) {
        console.log('ProjectForm: loading user ' + user.username);
        this.setState({
            token: user.token
        })
        // TODO: load user data/info
    }

    updateProjectId(event) {
        this.setState({
            id: event.target.value
        });
    }

    addProject() {
        console.log(this.state.id);
        console.log(this.state.token);
        axios.post(`${global.config.api_url}/joinProject`, {
            id: `${this.state.id}`,
        },
            {
                headers: { Authorization: `Bearer ${this.state.token}` }
            }).then(response => {
                var resp_data = null;
                if (response && response.data)
                    resp_data = response.data;
                console.log(resp_data.success);
                this.setState({
                    msg: "Success!",
                    color: "green"
                })
                setTimeout((_ => {
                    this.redirectPage('projects');
                }).bind(this), 550);
            }).catch(error => {
                if (error) {
                    var resp_data = null;
                    if (error.response && error.response.data)
                        resp_data = error.response.data;
                    console.log(resp_data.message);
                    this.setState({
                        msg: "Error: " + resp_data.message,
                        color: "red"
                    })
                }
            });
    }


    render() {
        return (
            <div className="center rightSide vCenter">
                <div className="formBorder">
                    <div className="centerTitle">
                        <h1> Join Project</h1>
                    </div>
                    {/* An area where users can create new project, by providing project name, description, and projectID. */}
                    <Form>
                        <Form.Group controlId="projectName">
                            <Form.Label>Project ID</Form.Label>
                            <Form.Control onChange={this.updateProjectId.bind(this)} type="name" placeholder="1" />
                        </Form.Group>
                    </Form>
                    <Button onClick={this.addProject.bind(this)}>
                        Join Project
                    </Button>
                    <div style={{ marginTop: '30px' }}>
                        <span className={this.state.color}>{this.state.msg}</span>
                    </div>

                </div>
            </div>
        );
    }
}

export default withRouter(JoinProject);