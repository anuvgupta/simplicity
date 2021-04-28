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
import NavigationBar from "./components/NavBar";
import JoinProject from './components/JoinProject.js';
import Admin from './components/Admin.js';

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
          <Route path="/home">
            <NavigationBar></NavigationBar>
            <SideBar active="overview"></SideBar>
            <Overview></Overview>
          </Route>
          <Route path="/admin">
            <NavigationBar></NavigationBar>
            <SideBar active="admin"></SideBar>
            <Admin mainView="false"></Admin>
          </Route>
          <Route path="/createProject">
            <NavigationBar></NavigationBar>
            <SideBar active="projects"></SideBar>
            <ProjectForm action="create"></ProjectForm>
          </Route>
          <Route path="/editProject/:id">
            <NavigationBar></NavigationBar>
            <SideBar active="projects"></SideBar>
            <ProjectForm action="edit"></ProjectForm>
          </Route>
          <Route path="/joinProject">
            <NavigationBar></NavigationBar>
            <SideBar active="projects"></SideBar>
            <JoinProject></JoinProject>
          </Route>
          <Route path="/projects">
            <NavigationBar></NavigationBar>
            <SideBar active="projects"></SideBar>
            <Projects mainView="true" hideButtons="false"></Projects>
          </Route>
          <Route path="/checkHardware">
            <NavigationBar></NavigationBar>
            <SideBar active="hardware"></SideBar>
          </Route>
          <Route path="/hardware">
            <NavigationBar></NavigationBar>
            <SideBar active="hardware"></SideBar>
            <Hardware mainView="true" ></Hardware>
            <div className="rightSide" style={{ marginBottom: '60px', marginTop: '55px' }}>
              <HardwareForm></HardwareForm>
            </div>
          </Route>
          <Route path="/datasets">
            <NavigationBar></NavigationBar>
            <SideBar active="datasets"></SideBar>
            <Datasets></Datasets>
          </Route>
          <Route path="/">
            <HomePage></HomePage>
          </Route>
        </Switch>
      </Router >
    </div >
  );
}

export default App;