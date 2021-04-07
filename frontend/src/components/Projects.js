import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Container, CardDeck, Card } from 'react-bootstrap';
import axios from 'axios'
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
        const { error, isLoaded, posts } = this.state;

        if (error) {
            return <div>Error in loading</div>
        } else if (!isLoaded) {
            return <div>Loading ...</div>
        } else {
            console.log(this.state.posts);
            return (
                <div className="">

                    <div className="centerTitle">
                        <h1> My Projects </h1>
                    </div>
                    {/* An area where users can create new project, by providing project name, description, and projectID. */}
                    <Container fluid className="rightSide test">
                        <CardDeck>
                            {this.state.posts.map((info) => (
                                <MyCard name={info.projectName}
                                    desc={info.desc}
                                    id={info.projectId} />
                            ))}
                        </CardDeck>
                    </Container>


                </div>
            );
        }
    }
}

export default Projects;