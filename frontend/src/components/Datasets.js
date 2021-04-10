import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Container, CardDeck, Card, Table } from 'react-bootstrap';
import axios from 'axios'
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import '../styles/project.css'

class Datasets extends React.Component {

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
            else this.setupPage(user);
        }).bind(this));
    }
    componentWillUnmount() {

    }

    redirectPage() {
        this.props.history.push('/home');
    }

    setupPage(user) {
        console.log('Datasets: loading user ' + user.username);
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
        return (

            <div className="rightSide" style={{ marginTop: '100px', marginBottom: '45px' }} >
                <h1> Datasets </h1>
                <div className="datasets" style={{ marginTop: '20px' }}>

                    <Table className="halfWidth" striped bordered hover>

                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Abdominal and Direct Fetal ECG Database</td>
                                <td><Button href="https://physionet.org/static/published-projects/adfecgdb/abdominal-and-direct-fetal-ecg-database-1.0.0.zip" target="_blank"> Downloand Zip </Button></td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>AF Termination Challenge Database</td>
                                <td><Button href="https://physionet.org/static/published-projects/aftdb/af-termination-challenge-database-1.0.0.zip" target="_blank"> Downloand Zip </Button></td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>AHA Database Sample Excluded Record</td>
                                <td><Button href="https://physionet.org/static/published-projects/ahadb/aha-database-sample-excluded-record-1.0.0.zip" target="_blank"> Downloand Zip </Button></td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>ANSI/AAMI EC13 Test Waveforms</td>
                                <td><Button href="https://physionet.org/static/published-projects/aami-ec13/ansiaami-ec13-test-waveforms-1.0.0.zip" target="_blank"> Downloand Zip </Button></td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>Apnea-ECG Database</td>
                                <td><Button href="https://physionet.org/static/published-projects/aami-ec13/ansiaami-ec13-test-waveforms-1.0.0.zip" target="_blank"> Downloand Zip </Button></td>
                            </tr>
                            <tr>
                                <td>6</td>
                                <td>A Pressure Map Dataset for In-bed Posture Classification</td>
                                <td><Button href="https://physionet.org/static/published-projects/pmd/a-pressure-map-dataset-for-in-bed-posture-classification-1.0.0.zip" target="_blank"> Downloand Zip </Button></td>
                            </tr>
                            <tr>
                                <td>7</td>
                                <td>BIDMC Congestive Heart Failure Database</td>
                                <td><Button href="https://physionet.org/static/published-projects/chfdb/bidmc-congestive-heart-failure-database-1.0.0.zip" target="_blank"> Downloand Zip </Button></td>
                            </tr>
                            <tr>
                                <td>8</td>
                                <td>BIDMC PPG and Respiration Dataset</td>
                                <td><Button href="https://physionet.org/static/published-projects/bidmc/bidmc-ppg-and-respiration-dataset-1.0.0.zip" target="_blank"> Downloand Zip </Button></td>
                            </tr>
                            <tr>
                                <td>9</td>
                                <td>Blood Pressure in Salt-Sensitive Dahl Rats</td>
                                <td><Button href="https://physionet.org/static/published-projects/bpssrat/blood-pressure-in-salt-sensitive-dahl-rats-1.0.0.zip" target="_blank"> Downloand Zip </Button></td>
                            </tr>
                            <tr>
                                <td>10</td>
                                <td>Body Sway When Standing and Listening to Music Modified to Reinforce Virtual Reality Environment Motion</td>
                                <td><Button href="https://physionet.org/static/published-projects/body-sway-music-vr/body-sway-when-standing-and-listening-to-music-modified-to-reinforce-virtual-reality-environment-motion-1.0.0.zip" target="_blank"> Downloand Zip </Button></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}


export default withRouter(Datasets);