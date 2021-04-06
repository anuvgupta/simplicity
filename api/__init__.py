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
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config.from_object(Config)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"        # connect to the MongoDB server to myDatabase --> database exposed as "db" attribute
mongo = PyMongo(app)
# db = mongo.db
app.config['MONGODB_SETTINGS']= {
    "db": "web-app",
}
db = MongoEngine(app)
CORS(app)


from api import routes

