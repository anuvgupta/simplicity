
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import HomePage from "./components/HomePage"
import Account from "./components/Account"
import LoginPage from "./components/LoginPage"
import RegisterPage from "./components/RegisterPage"
import ProjectForm from "./components/ProjectForm"
import HardwareForm from './components/HardwareForm';


function App() {
  const [getMessage, setGetMessage] = useState({})

  useEffect(() => {
    axios.get('http://localhost:5000/').then(response => {
      console.log("SUCCESS", response)
      setGetMessage(response)
    }).catch(error => {
      console.log(error)
    })

  }, [])
  return (
    <div className="App">
      <Router>
        <Switch>

          <Route path="/login">
            <LoginPage></LoginPage>
          </Route>

          <Route path="/register">
            <RegisterPage></RegisterPage>
          </Route>

          <Route path="/account">
            <Account></Account>
          </Route>
          <Route path="/createProject">
            <Account></Account>
            <ProjectForm></ProjectForm>
          </Route>
          <Route path="/project">
            {/* <Projects /> */}
            <Account></Account>
          </Route>
          <Route path="/editProject">
            <Account></Account>
            <ProjectForm></ProjectForm>
          </Route>
          <Route path="/checkHardware">
            <Account></Account>
            <HardwareForm></HardwareForm>
          </Route>
          <Route path="/hardware">
            <Account></Account>
          </Route>
          <Route path="/datasets">
            {/* <Projects /> */}
          </Route>

          <Route path="/">
            <HomePage></HomePage>
            {/* <div>{getMessage.status === 200 ?
        <h3>{getMessage.data.username}</h3>
        :
        <h3>Not found</h3>}
      </div> */}
          </Route>
        </Switch>

      </Router>

    </div>
  );
}

export default App;