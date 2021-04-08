"""
FILE: app/__init.py__

This file contains the application factory (Flask instance created here)
and allows 'site' to be treated like a package.
"""

import os

from flask import Flask
from config import Config
from flask_login import LoginManager
from flask_cors import CORS #comment this on deployment
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager
# from .routes import *
# from flask_pymongo import PyMongo


app = Flask(__name__)
app.config.from_object(Config)
""" Using MongoEngine instead of PyMongo but keeping this initialization in case stuff goes wrong """
# app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"        # connect to the MongoDB server to myDatabase --> database exposed as "db" attribute
# mongo = PyMongo(app)
# db = mongo.db

app.config['MONGODB_SETTINGS']= {
    "db": "web-app",
}
db = MongoEngine()
db.init_app(app)    # db initialization occurs before the app starts

jwt = JWTManager(app)

# flask-login initialization below, will delete later
login = LoginManager(app)
login.login_view = 'login'

CORS(app)

from .routes import *




