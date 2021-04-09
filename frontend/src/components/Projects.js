import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Container, CardDeck, Card } from 'react-bootstrap';
import axios from 'axios'
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import '../styles/project.css'


const MyCard = ({ name, id, desc }) => (
    <Card>
        <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>
                {desc}
            </Card.Text>
            <Button href={"/editProject/:"+id}>
                Edit Project
            </Button>
        </Card.Body>
        <Card.Footer>
            <small className="text-muted">{id}</small>
        </Card.Footer>
    </Card>
);

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
                console.log(resp_data);
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

        console.log(projects);
        return projects;
    }

    setupPage(user) {
        var username = user.username;
        username = username.toString();
        console.log("Project page " + username);
        axios.get(`${global.config.api_url}/user?username=` + username, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            console.log(resp_data);
            var projects = this.createCards(resp_data.data.projectList, user.token);
            console.log(projects);

            this.setState({
                projectList: resp_data.data.projectList,
                userToken: user.token,
                projectsArr: projects
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
        console.log(this.state);
        return (
            <div className="center">
                <div className="rightSide">
                    <div className="centerTitle">
                        <h1> My Projects </h1>
                    </div>
                    {/* An area where users can create new project, by providing project name, description, and projectID. */}
                    <Container fluid className="cardContainer">
                        <CardDeck>
                            {
                                this.state.projectList.length > 0 ?
                                    this.state.projectsArr.map((info, i) => (
                                        // need to avtually parse here
                                        <MyCard name={info.projectName}
                                            desc={info.description}
                                            id={info.id} key={i} />
                                    ))
                                    : <h1> There are no projects </h1>
                            }
                            {/* <Card className="bg-dark text-white">
                                <Card.ImgOverlay>
                                    <Card.Text>New Project</Card.Text>
                                </Card.ImgOverlay>
                            </Card> */}
                        </CardDeck>

                        <Button className="mt9px" onClick={this.redirectPage.bind(this, 'createProject')}>
                            New Project
                        </Button> {' '}
                        <Button className="mt9px" onClick={this.redirectPage.bind(this, 'joinProject')}>
                            Join Project
                        </Button>
                    </Container>
                </div>


            </div>
        );
    }
}

export default withRouter(Projects);