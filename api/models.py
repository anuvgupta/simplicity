"""
FILE: app/models.py

Define elements of the database
TESTER LOGIN:
username: sylviavu
email: sylviavu@utexas.edu
password: yoyo1234
"""
from api import login, db
from flask import jsonify
from flask_login import UserMixin
import mongoengine as me
from wtforms.validators import DataRequired, ValidationError
from werkzeug.security import generate_password_hash, check_password_hash


# function to be called to raise an error if a required field is left empty
def _not_empty(val):
    if not val:
        raise ValidationError('Value cannot be empty')


# defines fields for hardware sets
class Hardware(me.Document):
    name = me.StringField(max_length=20, required=True, unique=True, validation=_not_empty)
    capacity = me.IntField(min_value=0)
    available = me.IntField(min_value=0, max_value=capacity)


# defines fields for individual projects
# TODO: might change this to an EmbeddedDocument when I figure out how to connect projects to users
class Project(me.Document):
    project_id = me.StringField(max_length=20, required=True, unique=True, validation=_not_empty)
    hw_sets = me.DictField()        # will map hardware-set names to the quantity checked out for this project

    def __init__(self, id):
        self.project_id = id
        self.hw_sets = dict()


# defines fields for user accounts
class User(UserMixin, me.Document):
    username = me.StringField(max_length=50, required=True, unique=True, validation=_not_empty)
    email = me.StringField(max_length=50, required=True, unique=True, validation=_not_empty)
    password = me.StringField(max_length=50, required=True, validation=_not_empty)
    #password_hash = me.StringField() ==> hash passwords later

    def __init__(self, user, email, pwd):
        self.username = user
        self.email = email
        self.password = pwd



@login.user_loader
def load_user(id):
    return User.objects(id)


""" TO BE QUITE HONEST I DON'T KNOW IF MONGOENGINE WILL LET ME ADD FUNCTIONS INTO THE CLASSES SO HERE THEY ARE INSTEAD"""
""" USER-RELATED FUNCTIONS """
# function to create and save a new user to the database
def create_user(username, email, pwd):
    new_user = User(username, email, pwd)
    new_user.save(force_insert=True)    # creates a new document, doesn't allow for updates if this document already exists
    return


# check if the username already exists in the database 
def does_user_exist(input):
    retrieve = User.objects(username__exists=input)

    return retrieve


# get current user and return as json object
def query_user(input):
    user = User.objects(user__exact=input)

    return jsonify(user)



""" PROJECT-RELATION FUNCTIONS """
# create a new project and save to database
# TODO: we can change this later to take further inputs from the website 
#       e.g. if we wanna have checkboxes for hardware sets on the project creation page.
#       But for now the projects will just be created with a unique ID
def create_project(id):
    new_project = Project(id)
    new_project.save(force_insert=True)
    return


# use this function to checkout/check in hw sets
def checkin(hw_set, checkin_quantity):
    pass



def update_project(id, hw_set, checkin_quantity, checkout_quantity):
    # TODO: figure out how to update a single element in the DictField
    pass



def does_project_exist(input):
    pass



""" HARDWARE SET RELATED FUNCTIONS """
def checkin(hw_set, checkin_quantity):
    pass