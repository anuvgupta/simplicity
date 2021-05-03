// Docs page


import axios from 'axios';
import React from 'react';
import { Container, Form, Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';
import marked from 'marked';


import '../global';
import '../styles/settingspage.css';


class Docs extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            docs_content: "",
            username: "",
            token: ""
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

    redirectPage() {
        this.props.history.push('/');
    }

    setupPage(user) {
        console.log('Docs: loading user ' + user.username);
        this.setState({
            token: user.token,
            username: user.username,
        });
        // console.log("list is " + user.email);
        axios.get(`${global.config.api_url}/docs`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log('resp_data', resp_data);
            if (resp_data && resp_data.success && resp_data.success === true && resp_data.data && resp_data.data.docs_content) {
                // console.log(resp_data.data.docs_content);
                this.setState({
                    docs_content: resp_data.data.docs_content
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
    }

    getDocsHTML() {
        var docs_html = "<br/>";
        if (this.state.docs_content && (`${this.state.docs_content}`).trim() != "") {
            docs_html = (`${this.state.docs_content}`).trim();
        }
        console.log(docs_html);
        // docs_html = docs_html
        //     .split("# Simplicity Cloud\n").join('# <center>Simplicity Cloud</center><br/>')
        //     .split('**[Developer Documentation](#docs-dev)**').join('**[Developer Documentation](#docs-dev)**');
        docs_html = marked(docs_html);
        return { __html: docs_html };
    }

    render() {
        return (
            <div className="center projectMain" style={{ marginTop: '100px' }}>
                <div className="rightSideAlt">
                    <div className="centerTitle" style={{ marginBottom: '0', textAlign: 'center' }}>
                        <h1> Documentation </h1>
                    </div>
                    <div style={{ height: '1px' }}></div>
                    <div className="formBorder" style={{ maxWidth: '1200px', margin: '0 auto', boxShadow: 'none', border: '1px solid #f5f5f5' }}>
                        <div dangerouslySetInnerHTML={this.getDocsHTML()} style={{ marginBottom: '15px', textAlign: 'left' }}></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Docs);