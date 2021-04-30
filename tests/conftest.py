import pytest
import os
from flask import Flask
from config import Config
from flask_cors import CORS  # comment this on deployment
import mongoengine
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager




class TestConfig:
    TESTING = True
    SECRET_KEY = os.environ.get('SECRET_KEY') or '5tay0ut!'
    MONGODB_SETTINGS = {
        "db": "web-app",
        "host": "localhost",
        "port": 27017
    }


@pytest.fixture
def app():
    # db = MongoEngine()
    # app = Flask(__name__)
    # app.config.from_object(TestConfig)
    # # app.config['MONGODB_SETTINGS']= {
    # #     "db": "web-app-test",
    # #     "host": "localhost",
    # #     "port": 27017
    # # }
    # # with app.app_context():
    from api import app
    from api import User, Project, Hardware
    from api import routes
    from api import init_hardware, init_godmin
    app.config["TESTING"] = True
    return app
    


@pytest.fixture
def client(app):
    return app.test_client()

# @pytest.fixture
# def db(app):
#     test_db = MongoEngine()
#     test_db.init_app(app)
#     return db


# @pytest.fixture(autouse=True)
# def clean_db():
#     User.drop_collection()
#     Hardware.drop_collection()
#     Project.drop_collection()
