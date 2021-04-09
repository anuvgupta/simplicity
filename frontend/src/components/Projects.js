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
            else this.setupPage(user.username);
        }).bind(this));
    }
    componentWillUnmount() {

    }

    redirectPage() {
        this.props.history.push('/home');
    }

    setupPage(username) {
        console.log('Projects: loading user ' + username);
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
        const { error, isLoaded, posts } = this.state;

        if (error) {
            return <div>Error in loading</div>
        } else if (!isLoaded) {
            return <div>Loading ...</div>
        } else {
            console.log(this.state.posts);
            return (
                <div className="center">
                    <div className="rightSide">
                        <div className="centerTitle">
                            <h1> My Projects </h1>
                        </div>
                        {/* An area where users can create new project, by providing project name, description, and projectID. */}
                        <Container fluid className=" test">
                            <CardDeck>
                                {this.state.posts.map((info) => (
                                    <MyCard name={info.projectName}
                                        desc={info.desc}
                                        id={info.projectId} />
                                ))}
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
}

export default withRouter(Projects);