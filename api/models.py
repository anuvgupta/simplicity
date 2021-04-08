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
    name = me.StringField(max_length=50, required=True, unique=False)
    project_id = me.StringField(max_length=20, required=True, unique=True, validation=_not_empty)
    description = me.StringField(max_length=200)
    hw_sets = me.DictField()        # will map hardware-set names to the quantity checked out for this project


# defines fields for user accounts
class User(me.Document):
    username = me.StringField(max_length=50, required=True, unique=True, validation=_not_empty)
    email = me.StringField(max_length=50, required=True, unique=True, validation=_not_empty)    # we'll add this back in later
    password = me.StringField(max_length=72, required=True, validation=_not_empty)



""" USER-RELATED FUNCTIONS """
# function to create and save a new user to the database
def create_user(username, email, pwd):
    # TODO: implement bcrypt hashing for pwd
    new_user = User(username=username, email=email, password=pwd)
    new_user.save(force_insert=True)    # creates a new document, doesn't allow for updates if this document already exists
    return


# check if the username already exists in the database 
def does_user_name_exist(username) -> bool:
    query = User.objects(username__exact=username)
    if len(query) != 1:
        return False  # not found
    current_user = query.first
    if not current_user:
        return False  # not found
    if username != current_user.username:
        return False
    return True

# check if the user email already exists in the database 
def does_user_email_exist(email) -> bool:
    query = User.objects(email__exact=email)
    if len(query) != 1:
        return False  # not found
    current_user = query.first
    if not current_user:
        return False  # not found
    if email != current_user.email:
        return False
    return True


# find document with exact username (they all should be unique so only one should be found if it exists)
# see if password is correct
def verify_login(user, password) -> int:
    query = User.objects(username__exact=user)
    if len(query) != 1:
        return 404  # not found
    current_user = query.first()
    if not current_user:
        return 404  # not found
    if current_user.password == password:
        # TODO: implement bcrypt hashing for password
        return 1
    return 401


# get current user and return as json object
def get_user_json(input):
    user = User.objects(user__exact=input)
    return jsonify(user)


def get_user_obj(user):
    current_user = User.objects(username__exact=user)
    return current_user



""" PROJECT-RELATION FUNCTIONS """
# create a new project and save to database
def create_project(name, proj_id, desc):
    # new_project = Project(name=name, project_id=proj_id, description=desc, hw_sets=dict()
    # new_project.save(force_insert=True)
    return


def update_project(id, hw_set, checkin_quantity, checkout_quantity):
    # TODO: figure out how to update a single element in the DictField
    pass


def does_project_id_exist(p_id) -> bool:
    query = User.objects(project_id__exists=p_id)
    if len(query) != 1:
        return False  # not found
    project = query.first
    if not project:
        return False  # not found
    if p_id != project.id:
        return False  # incorrect id
    return True



""" HARDWARE SET RELATED FUNCTIONS """
def check_in(hw_set, checkin_quantity):
    pass


def check_out(hw_set, checkout_quantity):
    this_set = Hardware.objects(name__exact=hw_set)
    # check if requested quantity is valid
    if checkout_quantity > this_set.available:
        return jsonify({'msg': 'Quantity requested is greater than available inventory'})
    else:
        this_set.available -= checkout_quantity
        this_set.save()     # since the hardware set already existed, this saves the document with the new available quantity


def get_capacity_and_available(hw_set):
    return jsonify(capacity=hw_set.capacity, available=hw_set.available)
