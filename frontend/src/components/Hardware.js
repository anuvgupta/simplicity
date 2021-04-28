
import '../global.js'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import "../styles/hardware.css";
import HardwareForm from "../components/HardwareForm";



class Hardware extends React.Component {

    mounted = false;
    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            token: null,
            hw_set_usage: {},
            hwList: {},
            hwAvailabilityList: {},
            cardsPerColumn: 2,
            cardWidth: 415,
            querySetUp: false
        };
    }

    componentDidMount() {
        this.mounted = true;
        if (this.state.querySetUp === false) {
            this.setState({ querySetUp: true });
            global.util.resizeQuery((_ => {
                if (this.mounted) {
                    if (window.innerWidth < 1195) {
                        console.log('1');
                        this.setState({ cardsPerColumn: 1 });
                    } else if (window.innerWidth < 1495) {
                        console.log('2');
                        this.setState({ cardsPerColumn: 2 });
                    } else {
                        console.log('3');
                        this.setState({ cardsPerColumn: 3 });
                    }
                }
            }).bind(this));
        }
        global.api.authenticated((user => {
            if (user === false) this.redirectPage();
            else this.setupPage(user);
        }).bind(this));
    }
    componentWillUnmount() {
        this.mounted = false;

    }

    redirectPage() {
        this.props.history.push('/home');
    }

    setupPage(user) {
        console.log('Hardware: loading user ' + user.username);
        this.setState({
            token: user.token
        });
        var _next = _ => {
            global.util.resizeSchedule(100);
            axios.get(`${global.config.api_url}/user?username=${user.username}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            }).then(response => {
                var resp_data = null;
                if (response && response.data)
                    resp_data = response.data;
                // console.log('resp_data', resp_data);
                if (resp_data && resp_data.success && resp_data.success === true && resp_data.data && resp_data.data.hw_sets) {
                    console.log(resp_data);
                    this.setState({
                        hwAvailabilityList: resp_data.data.hw_sets
                    });
                } else console.log('Invalid response: ', resp_data);
            }).catch(error => {
                if (error) {
                    var resp_data = null;
                    if (error.response && error.response.data)
                        resp_data = error.response.data;
                    console.log(error);
                }
            });
        };
        this.getHardwareInfo(user.token, (resp, error = null) => {
            if (resp) {
                console.log(resp.data);
                this.setState({
                    hwList: resp.data
                })
                _next();
            } else {
                console.log(error);
            }
        });
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

    render() {
        return (
            <div className="center hwOverviewMain rightSide" style={{ marginTop: (this.props.mainView == 'true' ? '100px' : '40px') }}>
                <div className="centerTitle" style={{ marginBottom: '33px', textAlign: 'center' }}>
                    <h1> Hardware </h1>
                </div>

                <div className="hwTopPanel" style={{ maxWidth: `${this.state.cardsPerColumn * this.state.cardWidth + (this.state.cardsPerColumn > 1 ? 15 : 0)}px` }}>

                    {Object.keys(this.state.hwList).length > 0 ?
                        Object.values(this.state.hwList).map((hw_set, i) => (
                            <div key={i} className={((i + 1) % this.state.cardsPerColumn == 0 ? (this.state.cardsPerColumn % 2 == 0 ? 'hwRightOverview' : 'hwLeftOverview') : 'hwLeftOverview')}>
                                <div className="stack">
                                    <h2> {hw_set.name} </h2>
                                    <div className="hwOverviewCard">
                                        <h1 className="top" style={{ fontSize: '1.4em' }}> You have checked out </h1>
                                        <h1 className="num"> {this.state.hwAvailabilityList.hasOwnProperty(`${hw_set.hardware_id}`) ? this.state.hwAvailabilityList[hw_set.hardware_id] : 0} GB </h1>
                                        <h1 className="bottom" style={{ fontSize: '1.9em' }}> of {hw_set.hardware_id} </h1>
                                    </div>
                                </div>
                            </div>
                        )) : 'No hardware sets found.'}

                </div>

            </div>

        );
    }
}
export default withRouter(Hardware);