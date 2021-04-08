"""
FILE: app/models.py

Define elements of the database
TESTER LOGIN:
username: admin
password: admin
"""
from .__init__ import db
from flask import jsonify
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
    name = me.StringField(max_length=50, required=True, unique=True)
    project_id = me.StringField(max_length=20, required=True, unique=True, validation=_not_empty)
    hw_sets = me.DictField()        # will map hardware-set names to the quantity checked out for this project
    description = me.StringField(max_length=200)


# defines fields for user accounts
class User(me.Document):
    username = me.StringField(max_length=50, required=True, unique=True, validation=_not_empty)
    email = me.StringField(max_length=50, required=True, unique=True, validation=_not_empty)    # we'll add this back in later
    password = me.StringField(max_length=60, required=True, validation=_not_empty)


""" TO BE QUITE HONEST I DON'T KNOW IF MONGOENGINE WILL LET ME ADD FUNCTIONS INTO THE CLASSES SO HERE THEY ARE INSTEAD"""
""" USER-RELATED FUNCTIONS """
# function to create and save a new user to the database
def create_user(username, email, pwd):
    new_user = User(username=username, email=email, password=pwd)
    new_user.save(force_insert=True)    # creates a new document, doesn't allow for updates if this document already exists
    return


# check if the username already exists in the database 
def does_user_name_exist(username) -> bool:
    retrieve = User.objects(username__exact=username)
    return retrieve

# check if the user email already exists in the database 
def does_user_email_exist(email) -> bool:
    retrieve = User.objects(email__exact=email)
    return retrieve


# find document with exact username (they all should be unique so only one should be found if it exists)
# see if password is correct
def verify_login(user, pwd) -> bool:
    current_user = User.objects(username__exact=user)
    if not current_user:
        return False
    else:
        if current_user.password == pwd:
            return True


# get current user and return as json object
def get_user_json(input):
    user = User.objects(user__exact=input)
    return jsonify(user)


def get_user_obj(user):
    current_user = User.objects(username__exact=user)
    return current_user



""" PROJECT-RELATION FUNCTIONS """
# create a new project and save to database
# TODO: we can change this later to take further inputs from the website 
#       e.g. if we wanna have checkboxes for hardware sets on the project creation page.
#       But for now the projects will just be created with a unique ID
def create_project(id):
    # new_project = Project(id)
    # new_project.save(force_insert=True)
    return

def update_project(id, hw_set, checkin_quantity, checkout_quantity):
    # TODO: figure out how to update a single element in the DictField
    pass



def does_project_exist(input):
    pass



""" HARDWARE SET RELATED FUNCTIONS """
def check_in(hw_set, checkin_quantity):
    pass


def check_out(hw_set, checkout_quantity):
    pass


def get_capacity(hw_set):
    return jsonify(hw_set.capacity)


def get_available(hw_set):
    return jsonify(hw_set.available)