
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,

  Route, Switch
} from "react-router-dom";
import './App.css';
import Account from "./components/Account";
import HardwareForm from './components/HardwareForm';
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import ProjectForm from "./components/ProjectForm";
import Projects from './components/Projects';
import RegisterPage from "./components/RegisterPage";
import Datasets from "./components/Datasets";


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
            <Projects></Projects>
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
            Hardware
          </Route>
          <Route path="/datasets">
            {/* <Projects /> */}
            <Account></Account>
            Datasets
            <Datasets></Datasets>
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