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
            username: "",
            password: "",
            isLoaded: true,
            projectList: [],
            posts: [
                {
                    projectName: "test1",
                    projectId: "1",
                    desc: " Lorem impsum ldeokdeosjdoisejdis"
                },
                {
                    projectName: "test2",
                    projectId: "2",
                    desc: " Lorem impsum ldeokdeosjdoisejdis"
                },
                {
                    projectName: "test1",
                    projectId: "1",
                    desc: " Lorem impsum ldeokdeosjdoisejdis"
                },
                {
                    projectName: "test2",
                    projectId: "2",
                    desc: " Lorem impsum ldeokdeosjdoisejdis"
                },
                {
                    projectName: "test1",
                    projectId: "1",
                    desc: " Lorem impsum ldeokdeosjdoisejdis"
                },
                {
                    projectName: "test2",
                    projectId: "2",
                    desc: " Lorem impsum ldeokdeosjdoisejdis"
                },
            ],
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
        console.log('Projects: loading user ' + user.username);
        // TODO: load user data/info
    }

    updateUsername(event) {
        this.setState({
            username: event.target.value
        });
    }

    setupPage(user) {

        var username = user.username;
        username = username.toString();
        console.log(username);
        axios.get(`${global.config.api_url}/projects?username=` + username).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            console.log(resp_data);
            this.setState({
                projectList: resp_data.projectList
            });
        }).catch(error => {
            if (error) {
                var resp_data = null;
                if (error.response && error.response.data)
                    resp_data = error.response.data;
                console.log(resp_data);
            }
        });
    }
    render() {
        const { error, isLoaded, posts } = this.state;

        console.log(this.state);
        return (
            <div className="center">
                <div className="rightSide">
                    <div className="centerTitle">
                        <h1> My Projects </h1>
                    </div>
                    {/* An area where users can create new project, by providing project name, description, and projectID. */}
                    <Container fluid className=" test">
                        <CardDeck>
                            {
                                this.state.projectList.length > 0 ? 
                                    this.state.projectList.map((info) => (
                                        // need to avtually parse here
                                        <MyCard name={info.projectName}
                                            desc={info.desc}
                                            id={info.projectId} />
                                    ))
                                : <h1> There are no projects </h1> 
                                
                            
                            
                            }
                            {/* <Card className="bg-dark text-white">
                                <Card.ImgOverlay>
                                    <Card.Text>New Project</Card.Text>
                                </Card.ImgOverlay>
                            </Card> */}
                            </CardDeck>

                            <Button href="/createProject">
                                New Project
                            </Button>
                    </Container>
                </div>


            </div>
        );
    }
}

export default withRouter(Projects);