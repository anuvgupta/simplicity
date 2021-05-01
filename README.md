# EE461L Web App

This project is the semester project for EE461L.  
&nbsp;  
&nbsp;  
Created by Sylvia Vu, Pulkit Mahajan, and Anuv Gupta.

&nbsp;  
### Sources used

Backend:
- https://flask.palletsprojects.com/en/1.1.x/tutorial/factory/ - Used to set up the Flask application.
- https://realpython.com/introduction-to-mongodb-and-python/ - We wanted to find out how to use MongoDB with Flask and initially we thought our only option was to use PyMongo. With this website we came across MongoEngine and we found that MongoEngine was more pythonic and easier to read/use so committed to using MongoEngine.
- https://flask.palletsprojects.com/en/1.1.x/patterns/mongoengine/ - Used for setting up MongoEngine.
- https://docs.mongoengine.org/apireference.html - Used this documentation to navigate our use of MongoEngine.
- https://stackoverflow.com/questions/60803402/flask-jwt-or-flask-login - We needed a method of keeping a user logged-in if they have already signed in. Flask-login didn't seem to work well with the front-end without some hacky methods, so this stack overflow post helped us determine that we should use json web tokens instead.
- https://realpython.com/token-based-authentication-with-flask/ - Used to better understand jwt and helped with setup.
- https://flask-jwt-extended.readthedocs.io/en/stable/ - Used to navigate our use of flask-jwt.



