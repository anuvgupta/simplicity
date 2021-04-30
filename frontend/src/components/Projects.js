import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Container, CardDeck, Card } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import axios from 'axios';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import '../styles/project.css';



class ProjectCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            id: this.props.id,
            desc: this.props.desc,
            token: this.props.token,
            hideButtons: this.props.hideButtons === 'true',
            menuFade: 0.12,
            menuShowing: false,
            triggerDisplay: 'none',
            triggerOpacity: '0'
        };
    }


    componentDidMount() {

    }
    componentWillUnmount() {

    }

    menuShow() {
        if (!this.state.menuShowing && !this.state.hideButtons) {
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
        if (this.state.menuShowing && !this.state.hideButtons) {
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
        if (!this.state.hideButtons) {
            if (this.state.menuShowing) {
                this.menuHide();
            } else {
                this.menuShow();
            }
        }
    }

    deleteClick() {
        if (!this.state.hideButtons) {
            // console.log(`delete ${this.state.id}`);
            var confirmation = window.confirm(`Delete project "${this.state.id}"?`);
            if (!confirmation) return;
            axios.get(`${global.config.api_url}/projects?id=${this.state.id}&delete=true`, {
                headers: { Authorization: `Bearer ${this.state.token}` }
            }).then((response => {
                var resp_data = null;
                if (response && response.data)
                    resp_data = response.data;
                if (resp_data && resp_data.success && resp_data.success === true) {
                    if (resp_data.message) console.log(resp_data.message);
                    window.location.reload();
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
    }

    editClick() {
        if (!this.state.hideButtons) {
            window.location = String(window.location.origin + "/editProject/" + this.state.id);
        }
    }

    render() {
        return (<Card>
            <Card.Body style={{ position: 'relative' }}>
                <Card.Title>{this.state.name}</Card.Title>
                <Card.Text>
                    {this.state.desc}
                </Card.Text>
                <Button href={"/project/" + this.state.id} style={{ display: (this.state.hideButtons ? 'none' : 'inline-block'), color: 'black' }} variant="outlined" color="default">
                    Manage
                </Button>
                <div style={{
                    position: 'absolute',
                    top: '5px',
                    right: '4px',
                    width: '37px',
                    height: '37px',
                    display: (this.state.hideButtons ? 'none' : 'inline-block'),
                    zIndex: '9'
                }}>
                    <IconButton style={{ width: '36px', height: '36px' }} onClick={this.menuClick.bind(this)}>
                        <MoreVertIcon style={{ width: '24px', height: '24px' }}></MoreVertIcon>
                    </IconButton>
                </div>
                <div style={{
                    position: 'absolute',
                    top: '-1px',
                    right: '-71px',
                    display: `${this.state.triggerDisplay}`,
                    width: '70px',
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
            </Card.Body>
            <Card.Footer>
                <small className="text-muted">{this.state.id}</small>
            </Card.Footer>
        </Card>);
    }
}
class Projects extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            projectList: [],
            projectsArr: [],
            userToken: "",
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

    createCards(projectList, token) {
        // console.log("starting vcreate cards " + projectList[0]);
        var projects = [];
        for (var i = 0; i < projectList.length; i++) {
            // console.log("curr project id is " + projectList[i]);s
            axios.get(`${global.config.api_url}/projects?id=${projectList[i]}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
                var resp_data = null;
                if (response && response.data)
                    resp_data = response.data;
                // console.log(resp_data);
                projects.push(resp_data);
                this.setState({
                    projectsArr: projects
                });
            }).catch(error => {
                if (error) {
                    var resp_data = null;
                    if (error.response && error.response.data)
                        resp_data = error.response.data;
                    console.log(error);
                }
            });
        }

        // console.log(projects);
        return projects;
    }

    setupPage(user) {
        var username = user.username;
        username = username.toString();
        console.log("Project: loading user " + username);
        axios.get(`${global.config.api_url}/user?username=` + username, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log(resp_data);

            /*var projects =*/
            this.createCards(resp_data.data.projectList, user.token);
            // console.log(projects);

            this.setState({
                projectList: resp_data.data.projectList,
                userToken: user.token,
                // projectsArr: projects
            });
        }).catch(error => {
            if (error) {
                var resp_data = null;
                if (error.response && error.response.data)
                    resp_data = error.response.data;
                console.log("Error " + resp_data);
            }
        });
    }
    render() {
        // console.log(this.state);
        return (
            <div className="center projectMain" style={{ marginTop: (this.props.mainView == 'true' ? '100px' : '40px') }}>
                <div className="rightSideAlt">
                    <div className="centerTitle" style={{ marginBottom: '11px', textAlign: 'center' }}>
                        <h1> Projects </h1>
                    </div>
                    {/* An area where users can create new project, by providing project name, description, and projectID. */}
                    <Container fluid className="cardContainer">
                        <CardDeck>
                            {
                                this.state.projectList.length > 0 ?
                                    this.state.projectsArr.map((info, i) => (
                                        // need to actually parse here
                                        <ProjectCard name={info.projectName}
                                            desc={info.description}
                                            id={info.id} key={i}
                                            token={this.state.userToken}
                                            hideButtons={this.props.hideButtons} />
                                    ))
                                    : <div style={{ textAlign: 'center', width: '100%', marginTop: '10px' }}><h3 style={{ opacity: '0.8' }}> No projects found. </h3></div>
                            }
                            {/* <Card className="bg-dark text-white">
                                <Card.ImgOverlay>
                                    <Card.Text>New Project</Card.Text>
                                </Card.ImgOverlay>
                            </Card> */}
                        </CardDeck>
                        <div style={{ height: '45px' }}></div>
                        <Button variant="outlined" color="default" className="mt9px" onClick={this.redirectPage.bind(this, 'createProject')} style={{ display: (this.props.hideButtons === 'true' ? 'none' : 'inline-block') }}>
                            New Project
                        </Button>
                        <div style={{ display: 'inline-block', width: '10px', height: '1px' }}></div>
                        <Button variant="outlined" color="default" className="mt9px" onClick={this.redirectPage.bind(this, 'joinProject')} style={{ display: (this.props.hideButtons === 'true' ? 'none' : 'inline-block') }}>
                            Join Project
                        </Button>
                    </Container>
                </div>


            </div>
        );
    }
}

export default withRouter(Projects);