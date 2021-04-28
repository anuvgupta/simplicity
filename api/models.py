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
    name = me.StringField(max_length=20, required=True,
                          unique=True, validation=_not_empty)
    capacity = me.IntField(min_value=0)
    available = me.IntField(min_value=0, max_value=1024)


def init_hardware():
    query = Hardware.objects(name="hwSet1")
    hwSet1 = query.first()
    if not hwSet1:
        hw1 = Hardware(name="hwSet1", capacity=512, available=512)
        hw1.save(force_insert=True)
    query = Hardware.objects(name="hwSet2")
    hwSet2 = query.first()
    if not hwSet2:
        hw2 = Hardware(name="hwSet2", capacity=1024, available=1024)
        hw2.save(force_insert=True)
    # creates a new document, doesn't allow for updates if this document already exists

    return

# defines fields for individual projects
# TODO: might change this to an EmbeddedDocument when I figure out how to connect projects to users


class Project(me.Document):
    name = me.StringField(max_length=50, required=True, unique=False)
    owner = me.StringField(max_length=50, required=True, unique=False)
    project_id = me.StringField(
        max_length=20, required=True, unique=True, validation=_not_empty)
    description = me.StringField(max_length=200)


# defines fields for user accounts
class User(me.Document):
    username = me.StringField(
        max_length=50, required=True, unique=True, validation=_not_empty)
    email = me.StringField(max_length=50, required=True, unique=True,
                           validation=_not_empty)    # we'll add this back in later
    password = me.StringField(
        max_length=72, required=True, validation=_not_empty)
    projectList = me.ListField()
    # will map hardware-set names to the quantity checked out for this project
    hw_sets = me.DictField()
    is_admin = me.BooleanField(required=True, default=False) # admins (second level, users created by godmin)
    is_godmin = me.BooleanField(required=True, default=False) #Original admin (highest level, can create other admin)

def init_godmin():
    query = User.objects(username="admin")
    admin = query.first()
    if not admin:
        create_user("admin", "admin@admin", "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08", True, True)
    else:
        # TODO: Update project list and hardware list with everyone
        print("update stuff")
    # creates a new document, doesn't allow for updates if this document already exists

    return

""" USER-RELATED FUNCTIONS """
# function to create and save a new user to the database


def create_user(username, email, pwd, is_admin, is_godmin):
    # TODO: implement bcrypt hashing for pwd
    hw_set = {}
    hw1 = Hardware.objects(name="hwSet1")
    if len(hw1) != 1:
        return False  # not found
    hwSet1 = hw1.first()
    if not hwSet1:
        return False  # not found
    if hwSet1.name != "hwSet1":
        return False

    hw2 = Hardware.objects(name="hwSet2")
    if len(hw2) != 1:
        return False  # not found
    hwSet2 = hw2.first()
    if not hwSet2:
        return False  # not found
    if hwSet2.name != "hwSet2":
        return False

    hw_set[hwSet1.name] = 0
    hw_set[hwSet2.name] = 0

    if is_godmin == True:
        new_user = User(username=username, email=email,
                    password=pwd, projectList=[], hw_sets=hw_set, is_admin=True, is_godmin=True)
        new_user.save(force_insert=True)
        return
    else:
        if is_admin == True:
            new_user = User(username=username, email=email,
                    password=pwd, projectList=[], hw_sets=hw_set, is_admin=is_admin)
            new_user.save(force_insert=True)
            return
        else:
            new_user = User(username=username, email=email,
                        password=pwd, projectList=[], hw_sets=hw_set)
            # creates a new document, doesn't allow for updates if this document already exists
            new_user.save(force_insert=True)
            return


# check if the username already exists in the database
def does_user_name_exist(username) -> bool:
    query = User.objects(username__exact=username)
    if len(query) != 1:
        return False  # not found
    current_user = query.first()
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
    current_user = query.first()
    if not current_user:
        return False  # not found
    if email != current_user.email:
        return False
    return True


# find document with exact username (they all should be unique so only one should be found if it exists)
# see if password is correct
def verify_login(username, password) -> int:
    query = User.objects(username__exact=username)
    if len(query) != 1:
        return 404  # not found
    current_user = query.first()
    if not current_user:
        return 404  # not found
    # TODO: implement bcrypt hashing for password
    if current_user.password == password:
        return 1
    return 401


# get current user and return as json object
def get_user_json(username):
    query = User.objects(username__exact=username)
    if len(query) != 1:
        return None
    current_user = query.first()
    if not current_user:
        return None
    return jsonify({
        "username": current_user.username,
        "email": current_user.email,
        "projectList": current_user.projectList
    })

# get current user and return as mongoengine document


def get_user_obj(username):
    query = User.objects(username__exact=username)
    if len(query) != 1:
        return None
    current_user = query.first()
    if not current_user:
        return None
    return current_user


""" PROJECT-RELATION FUNCTIONS """
# create a new project and save to database


def create_project(name, proj_id, desc, username=""):
    new_project = Project(name=name, project_id=proj_id,
                          description=desc, owner=username)
    new_project.save(force_insert=True)
    if username != "":
        query = User.objects(username__exact=username)
        if len(query) != 1:
            return
        user = query.first()
        if not user:
            return
        user.projectList.append(proj_id)
        user.save()
    return


def update_project(name, p_id, desc):
    # TODO: figure out how to update a single element in the DictField
    query = Project.objects(project_id__exact=p_id)
    if len(query) < 1:
        return
    project = query.first()
    if not project:
        return
    if p_id != project.project_id:
        return
    project.name = name
    project.description = desc
    project.save()
    return


def get_project_json(project_id):
    query = Project.objects(project_id__exact=project_id)
    if len(query) != 1:
        return None
    project = query.first()
    if not project:
        return None
    return jsonify({
        "projectName": project.name,
        "id": project.project_id,
        "description": project.description
    })


def does_project_id_exist(p_id) -> bool:
    query = Project.objects(project_id__exact=p_id)
    if len(query) < 1:
        return False  # not found
    project = query.first()
    if not project:
        return False  # not found
    if p_id != project.project_id:
        return False  # incorrect id
    return True


""" HARDWARE SET RELATED FUNCTIONS """


def check_in(hw_set_name, checkin_quantity, username) -> int:
    queryA = Hardware.objects(name__exact=hw_set_name)
    if len(queryA) != 1:
        return 404
    hw_set = queryA.first()
    if not hw_set:
        return 404
    queryB = User.objects(username__exact=username)
    if len(queryB) != 1:
        return 404
    user = queryB.first()
    if not user:
        return 404
    # check if requested quantity is valid
    print(hw_set.capacity)
    if checkin_quantity > int(user.hw_sets[hw_set_name]): 
        #this is if the user tries to check in more than they've checked out
        return 400
    if checkin_quantity > int(hw_set.capacity):
        #this is when a user tries to check in more than capacity
        return 400
    hw_set.available += checkin_quantity
    hw_set.save()     # since the hardware set already existed, this saves the document with the new available quantity
    user.hw_sets[hw_set_name] -= checkin_quantity
    user.save()
    return 1


def check_out(hw_set_name, checkout_quantity, username):
    queryA = Hardware.objects(name__exact=hw_set_name)
    if len(queryA) != 1:
        return 404
    hw_set = queryA.first()
    if not hw_set:
        return 404
    queryB = User.objects(username__exact=username)
    if len(queryB) != 1:
        return 404
    user = queryB.first()
    if not user:
        return 404
    # check if requested quantity is valid
    if checkout_quantity > hw_set.available:
        return 400
    hw_set.available -= checkout_quantity
    hw_set.save()
    user.hw_sets[hw_set_name] += checkout_quantity
    user.save()
    return 1


def get_capacity_and_available(hw_set):
    return jsonify(capacity=hw_set.capacity, available=hw_set.available)


def does_hw_set_exist(hw_set_name) -> bool:
    query = Hardware.objects(name__exact=hw_set_name)
    if len(query) < 1:
        return False  # not found
    hardware_set = query.first()
    if not hardware_set:
        return False  # not found
    if hw_set_name != hardware_set.name:
        return False  # incorrect id
    return True
