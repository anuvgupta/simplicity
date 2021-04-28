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

# hw1 = Hardware(name="Set1", capacity=512)

jwt = JWTManager(app)

CORS(app)

from .routes import *
from .models import init_hardware

init_hardware()
init_godmin()

# defines fields for hardware sets

# def init_hardware(db):
#     # TODO: implement bcrypt hashing for pwd
    
#     # creates a new document, doesn't allow for updates if this document already exists
#     hw1.save(force_insert=True)
#     return
# class Hardware(MongoEngine.Document):
#     name = MongoEngine.StringField(max_length=20, required=True,
#                           unique=True, validation=_not_empty)
#     capacity = MongoEngine.IntField(min_value=0)
#     available = me.IntField(min_value=0, max_value=capacity)

