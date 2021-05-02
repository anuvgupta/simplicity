# EE461L Web App

This project is the semester project for EE461L.  
&nbsp;   
Created by Sylvia Vu, Pulkit Mahajan, and Anuv Gupta.
&nbsp;
&nbsp;
&nbsp;
# User Documentation Table of Contents
### [1. Getting Started](#1-getting-started)
* [What is Simplicity?](#what-is-simplicity?)
* [**Create** an account](#create-an-account)
* [How do I **sign in**?](#how-do-i-sign-in?)
### [2. Overview Page](#2-overview-page)
### [3. User Functions and Features](#3-user-functions-and-features)
* #### [3.1 Projects](#3.1-projects)
   * [What is a **project**?](#what-is-a-project?)
   * [**Create** a project](#create-a-project)
   * [**Join** a project](#join-a-project)
   * [**Edit** a project](#edit-a-project)
   * [**Delete** a project](#delete-a-project)
* #### [3.2 My Account]
   * [**Change** my username](#change-my-username)
   * [**Change** my email](#change-my-email)
   * [**Change** my password](#change-my-password)
   * [**Change** user theme](#change-user-theme)
### [4. Hardware Page](#4-hardware-page)
   * [What is hardware?](#what-is-hardware?)
   * [Hardware for a **project**](#hardware-for-a-project)
   * [Hardware for **personal use**](#hardware-for-personal-use)
   * [**Checking out** hardware](#checking-out-hardware)
   * [**Checking in** hardware](#checking-in-hardware)
### [5. Datasets Page](#5-datasets-page)
   * [What is a dataset?](#what-is-a-dataset?)
   * [**Downloading** a dataset](#downloading-a-dataset)

&nbsp;
&nbsp;
&nbsp;
&nbsp;
  
## <a name="1-getting-started"></a>Getting Started
* #### <a name="what-is-simplicity?"></a>What is Simplicity?

* #### <a name="create-an-account"></a>**Create** an account

* #### <a name="how-do-i-sign-in?"></a>How do I **sign in**?


### 2. Overview Page


### [3. User Functions and Features](#3.-user-functions-and-features)
   - #### [3.1 Projects](3.1-projects)
      - ##### What is a project?  
  
  
  
  

  
  
  
  
  
[1.Getting Started]:
[What is Simplicity?]:
[**Create** an account]:
[How do I **sign in**?]:

[2. Overview Page]:
[3. User Functions and Features]:
[3.1 Projects]:
[What is a **project**?]:
[**Create** a project]:
[**Join** a project]:
[**Edit** a project:
[**Delete** a project:
[3.2 My Account]:
[**Change** my username]:
[**Change** my email]:
[**Change** my password]:
[**Change** user theme]:

[4. Hardware Page]:
[What is hardware?]:
[Checking out/in hardware to a **project**]:
[Checking out/in hardware for **personal use**]:
[**Checking out** hardware]:
[**Checking in** hardware]:

[5. Datasets Page]:
[What is a dataset?]:
[**Downloading** a dataset]:





&nbsp;  
## Sources used

Backend:
- https://flask.palletsprojects.com/en/1.1.x/tutorial/factory/ - Used to set up the Flask application.
- https://realpython.com/introduction-to-mongodb-and-python/ - We wanted to find out how to use MongoDB with Flask and initially we thought our only option was to use PyMongo. With this website we came across MongoEngine and we found that MongoEngine was more pythonic and easier to read/use so committed to using MongoEngine.
- https://flask.palletsprojects.com/en/1.1.x/patterns/mongoengine/ - Used for setting up MongoEngine.
- https://docs.mongoengine.org/apireference.html - Used this documentation to navigate our use of MongoEngine.
- https://stackoverflow.com/questions/60803402/flask-jwt-or-flask-login - We needed a method of keeping a user logged-in if they have already signed in. Flask-login didn't seem to work well with the front-end without some hacky methods, so this stack overflow post helped us determine that we should use json web tokens instead.
- https://realpython.com/token-based-authentication-with-flask/ - Used to better understand jwt and helped with setup.
- https://flask-jwt-extended.readthedocs.io/en/stable/ - Used to navigate our use of flask-jwt.



