import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Container, CardDeck, Card } from 'react-bootstrap';
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


            <Container className="rightSide">
                <div className="datasets">
                    <div>
                        <span>Abdominal and Direct Fetal ECG Database</span>
                        <a href="https://physionet.org/static/published-projects/adfecgdb/abdominal-and-direct-fetal-ecg-database-1.0.0.zip" target="_blank">Download</a>
                    </div>
                    <div>
                        <span>AF Termination Challenge Database</span>
                        <a href="https://physionet.org/static/published-projects/aftdb/af-termination-challenge-database-1.0.0.zip" target="_blank">Download</a>
                    </div>
                    <div>
                        <span>AHA Database Sample Excluded Record</span>
                        <a href="https://physionet.org/static/published-projects/ahadb/aha-database-sample-excluded-record-1.0.0.zip" target="_blank">Download</a>
                    </div>
                    <div>
                        <span>ANSI/AAMI EC13 Test Waveforms</span>
                        <a href="https://physionet.org/static/published-projects/aami-ec13/ansiaami-ec13-test-waveforms-1.0.0.zip" target="_blank">Download</a>
                    </div>
                    <div>
                        <span>Apnea-ECG Database</span>
                        <a href="https://physionet.org/static/published-projects/aami-ec13/ansiaami-ec13-test-waveforms-1.0.0.zip" target="_blank">Download</a>
                    </div>
                    <div>
                        <span>A Pressure Map Dataset for In-bed Posture Classification</span>
                        <a href="https://physionet.org/static/published-projects/pmd/a-pressure-map-dataset-for-in-bed-posture-classification-1.0.0.zip" target="_blank">Download</a>
                    </div>
                    <div>
                        <span>BIDMC Congestive Heart Failure Database</span>
                        <a href="https://physionet.org/static/published-projects/chfdb/bidmc-congestive-heart-failure-database-1.0.0.zip" target="_blank">Download</a>
                    </div>
                    <div>
                        <span>BIDMC PPG and Respiration Dataset</span>
                        <a href="https://physionet.org/static/published-projects/bidmc/bidmc-ppg-and-respiration-dataset-1.0.0.zip" target="_blank">Download</a>
                    </div>
                    <div>
                        <span>Blood Pressure in Salt-Sensitive Dahl Rats</span>
                        <a href="https://physionet.org/static/published-projects/bpssrat/blood-pressure-in-salt-sensitive-dahl-rats-1.0.0.zip" target="_blank">Download</a>
                    </div>
                    <div>
                        <span>Body Sway When Standing and Listening to Music Modified to Reinforce Virtual Reality Environment Motion</span>
                        <a href="https://physionet.org/static/published-projects/body-sway-music-vr/body-sway-when-standing-and-listening-to-music-modified-to-reinforce-virtual-reality-environment-motion-1.0.0.zip" target="_blank">Download</a>
                    </div>


                </div>


            </Container>
        );
    }
}


export default withRouter(Datasets);