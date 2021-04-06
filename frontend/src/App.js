
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios'

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
      <div className="centerTitle">
        <h1> Welcome to [NAME TBD] </h1>
      </div>
      <div className="homepageOptions">
        <Button href="login"> Login</Button> {' '}
        <Button href="login"> Sign Up </Button>
      </div>
      <div>{getMessage.status === 200 ?
        <h3>{getMessage.data.username}</h3>
        :
        <h3>Not found</h3>}
      </div>
    </div>
  );
}

export default App;