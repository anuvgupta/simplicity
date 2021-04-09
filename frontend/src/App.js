// app

import axios from 'axios';
import { Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './global.js';
import './App.css';
import SideBar from "./components/SideBar";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProjectForm from "./components/ProjectForm";
import HardwareForm from './components/HardwareForm';
import Hardware from './components/Hardware';
import HomePage from "./components/HomePage";
import Projects from './components/Projects';
import Datasets from "./components/Datasets";
import Overview from "./components/Overview";
import JoinProject from './components/JoinProject.js';

function App() {

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
            <SideBar></SideBar>
            <Overview></Overview>
          </Route>
          <Route path="/createProject">
            <SideBar></SideBar>
            <ProjectForm action="create"></ProjectForm>
          </Route>
          <Route path="/editProject/:id">
            <SideBar></SideBar>
            <ProjectForm action="edit"></ProjectForm>
          </Route>
          <Route path="/joinProject">
            <SideBar></SideBar>
            <JoinProject></JoinProject>
          </Route>
          <Route path="/project">
            {/* <Projects /> */}
            <SideBar></SideBar>
            <Projects></Projects>

          </Route>
          <Route path="/editProject">
            <SideBar></SideBar>
            <ProjectForm></ProjectForm>
          </Route>
          <Route path="/checkHardware">
            <SideBar></SideBar>


          </Route>
          <Route path="/hardware">
            <SideBar></SideBar>
            <Hardware></Hardware>
            <div className="rightSide">
              <HardwareForm></HardwareForm>
            </div>

            {/* <Projects /> */}

          </Route>
          <Route path="/datasets">
            {/* <Projects /> */}
            <SideBar></SideBar>
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

      </Router >

    </div >
  );
}

export default App;