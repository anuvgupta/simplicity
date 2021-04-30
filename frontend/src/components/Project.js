/*  Project.js  */

import '../global.js';
import axios from 'axios';
import React from 'react';
import { Form, Table } from 'react-bootstrap';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/project.css';


class Project extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            projectID: "...",
            projectName: "Projects",
            projectDescription: "Loading...",
            hwSetUsage: {},
            hwList: {},
            token: "",
            menuFade: 0.12,
            menuShowing: false,
            triggerDisplay: 'none',
            triggerOpacity: '0'
        };
    }

    componentDidMount() {
        global.api.authenticate((user => {
            if (user === false) this.redirectPage();
            else this.setupPage(user);
        }).bind(this));
    }
    componentWillUnmount() {

    }

    redirectPage(page = '') {
        this.props.history.push(`/${page}`);
    }

    setupPage(user) {
        console.log('Project: loading user ' + user.username);
        // TODO: load user data/info
        var project_id = '';
        if (this.props.match.params.hasOwnProperty('id'))
            project_id = (`${this.props.match.params.id}`).trim();
        this.setState({
            token: user.token,
            projectID: `${project_id}`
        });
        if (project_id.length <= 0 || project_id == '') {
            this.redirectPage('projects');
            return;
        }
        var _next = (_ => {
            console.log('Project ID: ' + project_id);
            axios.get(`${global.config.api_url}/projects?id=${project_id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            }).then((response => {
                // console.log(response);
                var resp_data = null;
                if (response && response.data)
                    resp_data = response.data;
                // console.log('resp_data', resp_data);
                if (resp_data && resp_data.projectName && resp_data.id && resp_data.description) {

                    // console.log(resp_data);
                    this.setState({
                        projectName: resp_data.projectName,
                        projectDescription: resp_data.description,
                        hwSetUsage: resp_data.hw_dict ? resp_data.hw_dict : {}
                    });
                } else console.log('Invalid response: ', resp_data);
            }).bind(this)).catch(error => {
                if (error) {
                    var resp_data = null;
                    if (error.response && error.response.data)
                        resp_data = error.response.data;
                    console.log(error, resp_data);
                }
            });
        }).bind(this);
        this.getHardwareInfo(user.token, ((resp, error = null) => {
            if (resp) {
                this.setState({
                    hwList: resp.data
                })
            } else console.log(error);
            _next();
        }).bind(this));
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

    backButtonClick() {
        this.redirectPage('projects');
    }

    getHardwareInfo(token, resolve) {
        axios.post(`${global.config.api_url}/checkHardware`, {},
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log(this.state);
            // console.log(resp_data);
            resolve(resp_data);
        }).catch(error => {
            if (error) {
                var resp_data = null;
                if (error.response && error.response.data)
                    resp_data = error.response.data;
                console.log(error, resp_data);
                // console.log("here");
                resolve(false, resp_data);
            }
        });
    }

    menuShow() {
        if (!this.state.menuShowing) {
            this.setState({ triggerDisplay: 'block' });
            setTimeout((_ => {
                this.setState({ triggerOpacity: '1' });
                setTimeout((_ => {
                    this.setState({ menuShowing: true });
                }).bind(this), this.state.menuFade * 1000)
            }).bind(this), 10);
        }
    }
    menuHide() {
        if (this.state.menuShowing) {
            this.setState({ triggerOpacity: '0' });
            setTimeout((_ => {
                this.setState({ triggerDisplay: 'none' });
                setTimeout((_ => {
                    this.setState({ menuShowing: false });
                }).bind(this), 10)
            }).bind(this), this.state.menuFade * 1000);
        }
    }
    menuClick() {
        if (this.state.menuShowing) {
            this.menuHide();
        } else {
            this.menuShow();
        }
    }

    deleteClick() {
        // console.log(`delete ${this.state.id}`);
        var confirmation = window.confirm(`Delete project "${this.state.projectID}"?`);
        if (!confirmation) return;
        axios.get(`${global.config.api_url}/projects?id=${this.state.projectID}&delete=true`, {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }).then((response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            if (resp_data && resp_data.success && resp_data.success === true) {
                if (resp_data.message) console.log(resp_data.message);
                this.redirectPage('projects');
            } else {
                console.log(resp_data);
                if (resp_data.message)
                    alert(`${resp_data.message}`);
            }
        }).bind(this)).catch(error => {
            if (error) {
                var resp_data = null;
                if (error.response && error.response.data)
                    resp_data = error.response.data;
                console.log(error);
                if (resp_data.message)
                    alert(`${resp_data.message}`);
            }
        });
    }

    editClick() {
        window.location = String(window.location.origin + "/editProject/" + this.state.projectID + '?next=project/' + this.state.projectID);
    }

    getDictTotal(dictionary_obj) {
        var total = 0;
        for (var i in dictionary_obj) {
            if (dictionary_obj.hasOwnProperty(i)) {
                total += dictionary_obj[i];
            }
        }
        if (total < 0) total = 0;
        return total;
    }

    render() {
        let hw_sets_used = (Object.keys(this.state.hwSetUsage).length <= 0 || this.getDictTotal(this.state.hwSetUsage) <= 0);
        return (
            <div className="center projectMain" style={{ marginTop: '100px' }}>
                <div className="rightSideAlt" style={{ position: 'relative' }}>
                    <div className="centerTitle" style={{ marginBottom: '11px', textAlign: 'center', marginTop: '3px' }}>
                        <h1> {this.state.projectName} </h1>
                        <h4 style={{ color: '#444', fontSize: '22px' }}> {this.state.projectID} </h4>
                    </div>
                    <div style={{ marginTop: '35px' }}>
                        <p> {this.state.projectDescription} </p>
                    </div>
                    <div style={{ marginTop: '65px' }}>
                        <h3 style={{ marginBottom: '12.5px' }}>Hardware</h3>
                        <Table className="halfWidth" striped bordered hover style={{ marginTop: '10px' }}>
                            {/* <tr>
                                    <td>1</td>
                                    <td>Abdominal and Direct Fetal ECG Database</td>
                                    <td><Button href="https://physionet.org/static/published-projects/adfecgdb/abdominal-and-direct-fetal-ecg-database-1.0.0.zip" target="_blank"> Download ZIP </Button></td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>AF Termination Challenge Database</td>
                                    <td><Button href="https://physionet.org/static/published-projects/aftdb/af-termination-challenge-database-1.0.0.zip" target="_blank"> Download ZIP </Button></td>
                                </tr> */}

                            <thead style={{ display: (hw_sets_used ? 'none' : 'table-header-group') }}>
                                <tr>
                                    <th colSpan="2">Hardware Set</th>
                                    <th>Checked Out</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ((hw_sets_used)
                                        ?
                                        ((_ => (
                                            <tr><td>No hardware checked out for this project.</td></tr>
                                        )).bind(this))()
                                        :
                                        ((_ => (
                                            Object.values(this.state.hwList).map((hw_set, i) => {
                                                if (this.state.hwSetUsage.hasOwnProperty(hw_set.hardware_id) && this.state.hwSetUsage[hw_set.hardware_id] > 0) {
                                                    return (
                                                        <tr key={i}>
                                                            <td> {hw_set.hardware_id} </td>
                                                            <td> {hw_set.name} </td>
                                                            <td> {this.state.hwSetUsage[hw_set.hardware_id]} </td>
                                                        </tr>
                                                    );
                                                }
                                            })
                                        )).bind(this))()
                                    )
                                }
                            </tbody>
                        </Table>
                    </div>

                    <div style={{ position: 'absolute', top: '5px', left: '5px' }}>
                        <Button style={{ padding: '5px 20px', opacity: '0.92' }} color="default" startIcon={<ArrowBackIosIcon />} onClick={this.backButtonClick.bind(this)}>Back</Button>
                    </div>
                    <div style={{ position: 'absolute', top: '2px', right: '5px' }}>
                        <IconButton style={{ width: '36px', height: '36px' }} onClick={this.menuClick.bind(this)}>
                            <MoreVertIcon style={{ width: '24px', height: '24px' }}></MoreVertIcon>
                        </IconButton>
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '50px',
                        display: `${this.state.triggerDisplay}`,
                        width: '90px',
                        height: 'auto',
                        minHeight: '30px',
                        border: '1px solid #ececec',
                        borderRadius: '2px',
                        transition: `opacity ${this.state.menuFade}s ease`,
                        opacity: `${this.state.triggerOpacity}`,
                        zIndex: '10',
                        backgroundColor: 'white',
                        boxShadow: '0.5px 1px 3px 2px rgba(0,0,0,0.035)',
                        WebkitBoxShadow: '0.5px 1px 3px 2px rgba(0,0,0,0.035)'
                    }}>
                        <div className="projectCardMenuItem" onClick={this.editClick.bind(this)}>
                            Edit
                        </div>
                        <div className="projectCardMenuItem" onClick={this.deleteClick.bind(this)}>
                            Delete
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Project);