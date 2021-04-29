
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
            projectID: "",
            projectName: "",
            projectDescription: "",
            initialProjectID: "",
            initialProjectName: "",
            initialProjectDescription: "",
            errorMsg: "",
            token: "",
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
        // TODO: load user data/info
        var project_id = '';
        if (this.props.match.params.hasOwnProperty('id'))
            project_id = this.props.match.params.id;
        this.setState({
            token: user.token,
            projectID: `${project_id}`,
            initialProjectID: `${project_id}`
        });
        if (this.props.action == 'edit') {
            axios.get(`${global.config.api_url}/projects?id=${project_id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            }).then(response => {
                console.log(response);
                var resp_data = null;
                if (response && response.data)
                    resp_data = response.data;
                // console.log('resp_data', resp_data);
                if (resp_data && resp_data.projectName && resp_data.id && resp_data.description) {
                    this.setState({
                        projectName: resp_data.projectName,
                        projectDescription: resp_data.description,
                        initialProjectName: resp_data.projectName,
                        initialProjectDescription: resp_data.description,
                    });
                } else console.log('Invalid response: ', resp_data);
            }).catch(error => {
                if (error) {
                    var resp_data = null;
                    if (error.response && error.response.data)
                        resp_data = error.response.data;
                    console.log(error, resp_data);
                }
            });
        }
    }

    updateProjectID(event) {
        this.setState({
            projectID: event.target.value
        });
    }

    updateProjectName(event) {
        this.setState({
            projectName: event.target.value
        });
    }

    updateProjectDescription(event) {
        this.setState({
            projectDescription: event.target.value
        });
    }

    updateErrorMsg(value) {
        this.setState({
            errorMsg: value
        });
    }

    requestForProject(projectID, projectName, projectDescription) {
        const action = this.props.action;
        var handleResponse = response => {
            var errorMessage = 'Unknown error.';
            if (response && response.hasOwnProperty('success')) {
                if (response.success === true) {
                    errorMessage = null;
                } else {
                    if (response.hasOwnProperty('message') && typeof response.message === 'string') {
                        errorMessage = response.message;
                    }
                }
            }
            if (errorMessage) {
                this.setState({
                    errorMsg: errorMessage
                });
            } else {
                this.redirectPage('projects');
            }
        };
        axios.post(`${global.config.api_url}/${action}Project`, {
            id: `${projectID}`,
            name: `${projectName}`,
            desc: `${projectDescription}`
        }, {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            handleResponse(resp_data);
        }).catch(error => {
            if (error) {
                var resp_data = null;
                if (error.response && error.response.data)
                    resp_data = error.response.data;
                handleResponse(resp_data);
            }
        });
    }

    validateForm(sendRequest = false) {
        var projectID = this.state.projectID;
        var projectName = this.state.projectName;
        var projectDescription = this.state.projectDescription;
        if (projectID && projectID.trim().length > 0) {
            if (projectName && projectName.trim().length > 0) {
                if (projectDescription && projectDescription.trim().length > 0) {
                    if (global.util.validateAlphanumeric(projectID)) {
                        if (sendRequest) this.requestForProject(projectID, projectName, projectDescription);
                    } else this.updateErrorMsg('Invalid projectID (letters and numbers only).');
                } else this.updateErrorMsg('Empty project description.');
            } else this.updateErrorMsg('Empty project name.');
        } else this.updateErrorMsg('Empty project ID.');
    }

    render() {
        const action = this.props.action;
        const action_title = (`${action[0]}`).toUpperCase() + (`${action.substring(1)}`);
        const create = action == 'create';
        return (
            <div className="center rightSide vCenter">
                <div className="formBorder">
                    <div className="centerTitle" style={{ marginBottom: '15px' }}>
                        <h1> {action_title} Project </h1>
                    </div>
                    {/* An area where users can create new project, by providing project name, description, and projectID. */}
                    <Form>
                        <Form.Group controlId="projectName">
                            <Form.Label style={{ opacity: (create ? '1' : '0.9'), marginTop: '0.5em' }}>Project ID</Form.Label>
                            <Form.Control type="text" placeholder="testProject1" disabled={!create} defaultValue={create ? '' : this.state.initialProjectID} onChange={this.updateProjectID.bind(this)} style={{ opacity: (create ? '1' : '0.7'), marginBottom: '10px' }} />
                            <Form.Label style={{ marginTop: '0.5em' }}>Project Name</Form.Label>
                            <Form.Control type="text" placeholder="Test Project" defaultValue={create ? '' : this.state.initialProjectName} onChange={this.updateProjectName.bind(this)} style={{ marginBottom: '10px' }} />
                            <Form.Label style={{ marginTop: '0.5em' }}>Project Description</Form.Label>
                            <Form.Control type="text" as="textarea" rows={3} defaultValue={create ? '' : this.state.initialProjectDescription} placeholder="Lorem ipsum dolor sit amet..." onChange={this.updateProjectDescription.bind(this)} style={{ marginBottom: '10px' }} />
                            <Button onClick={this.validateForm.bind(this, true)} style={{ marginTop: '20px' }}> {action_title} Project </Button>
                        </Form.Group>
                        <span className="errorMessage" style={{ paddingTop: '15px' }}>{this.state.errorMsg}</span>
                    </Form>

                </div>
            </div>
        );
    }
}

export default withRouter(ProjectForm);