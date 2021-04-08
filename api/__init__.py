"""
FILE: app/__init.py__

This file contains the application factory (Flask instance created here)
and allows 'site' to be treated like a package.
"""

import os

from flask import Flask
from config import Config
from flask_cors import CORS #comment this on deployment
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager

db = MongoEngine() # db initialization occurs before the app starts

app = Flask(__name__)
app.config.from_object(Config)

app.config['MONGODB_SETTINGS']= {
    "db": "web-app",
    "host": "localhost",
    "port": 27017
}
db.init_app(app)

jwt = JWTManager(app)

CORS(app)

from .routes import *




