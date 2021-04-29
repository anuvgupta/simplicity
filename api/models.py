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
    hardware_id = me.StringField(max_length=20, required=True, unique=True, validation=_not_empty)
    name = me.StringField(max_length=40, required=True, unique=False, validation=_not_empty)
    capacity = me.IntField(min_value=0)
    available = me.IntField(min_value=0, max_value=1024)


def init_hardware():
    query = Hardware.objects(hardware_id="hwSet1")
    hwSet1 = query.first()
    if not hwSet1:
        hw1 = Hardware(hardware_id="hwSet1", name="Hardware Set 1", capacity=512, available=512)
        hw1.save(force_insert=True)
    query = Hardware.objects(hardware_id="hwSet2")
    hwSet2 = query.first()
    if not hwSet2:
        hw2 = Hardware(hardware_id="hwSet2", name="Hardware Set 2", capacity=1024, available=1024)
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
    navColor = me.StringField()

def init_godmin():
    # projectList = []
    # for project in Project.objects:
    #     for id in project.project_id:
    #         if id not in projectList:
    #             # print(id)
    #             projectList.append(id)
    
    query = User.objects(username="admin")
    admin = query.first()
    if not admin:
        create_user("admin", "admin@admin", "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08", [], True, True)
    else:
        # TODO: Update project list and hardware list with everyone
        # So admin exists -> there is at least 1 user
        # print("update stuff")
        # admin.update(set__projectList=projectList)
        pass
    # creates a new document, doesn't allow for updates if this document already exists
    return

""" USER-RELATED FUNCTIONS """
# function to create and save a new user to the database


def create_user(username, email, pwd, project_list = None, is_admin = False, is_godmin = False):
    # TODO: implement bcrypt hashing for pwd
    hw_set = {}
    projectList = []
    if project_list:
       projectList = project_list 
    if is_godmin == True:
        new_user = User(username=username, email=email,
                    password=pwd, projectList=projectList, hw_sets=hw_set, is_admin=True, is_godmin=True)
        new_user.save(force_insert=True)
        return
    else:
        if is_admin == True:
            new_user = User(username=username, email=email,
                    password=pwd, projectList=projectList, hw_sets=hw_set, is_admin=is_admin)
            new_user.save(force_insert=True)
            return
        else:
            new_user = User(username=username, email=email,
                        password=pwd, projectList=projectList, hw_sets=hw_set)
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


def compare_passwords(password_A, password_B) -> bool:
    # TODO: implement bcrypt hashing for password
    return password_A == password_B

# find document with exact username (they all should be unique so only one should be found if it exists)
# see if password is correct
def verify_login(username, password) -> int:
    query = User.objects(username__exact=username)
    if len(query) != 1:
        return 404  # not found
    current_user = query.first()
    if not current_user:
        return 404  # not found
    if compare_passwords(current_user.password, password):
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

def set_user_theme(username, theme):
    query = User.objects(username__exact=username)
    if len(query) != 1:
        return None
    current_user = query.first()
    if not current_user:
        return None
    current_user.update(set__navColor=theme)
    return

def update_user(currName, currPwd, username, email, password, is_admin):
    query = User.objects(username__exact=currName)
    if len(query) != 1:
        return (False, "User not found.")
    current_user = query.first()
    if not current_user:
        return (False, "User not found.")
    if not compare_passwords(currPwd, current_user.password):
        return (False, "Incorrect password.")
    # current_user.update(set__username=username)
    # current_user.update(set__email=email)
    # current_user.update(set__password=password)
    current_user.username = username
    current_user.email = email
    current_user.password = password
    current_user.is_admin = is_admin
    current_user.save()
    return (True, "")


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

def delete_project_from_users(proj_id):
    if not proj_id:
        return
    selected_users = User.objects(projectList=proj_id)
    for user in selected_users:
        if proj_id in user.projectList:
            user.projectList.remove(proj_id)
            user.save()
    return

def delete_project(proj_id, username) -> bool:
    if not does_user_name_exist(username):
        return (False, "User not found.")
    queryA = User.objects(username__exact=username)
    if len(queryA) != 1:
        return (False, "User not found.")
    user = queryA.first()
    if not user:
        return (False, "User not found.")
    if not does_project_id_exist(proj_id):
        return (False, "Project not found.")
    queryB = Project.objects(project_id__exact=proj_id)
    if len(queryB) != 1:
        return (False, "Project not found.")
    proj = queryB.first()
    if not proj:
        return (False, "Project not found.")
    if not (proj_id in user.projectList):
        if username != "admin":
            return (False, "Project does not belong to user.")
    else:
        user.projectList.remove(proj_id)
        user.save()
    delete_project_from_users(proj_id)
    proj.delete()
    return (True, "")

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

def get_project_ids() -> []:
    projectIds = []
    query = Project.objects()
    for project in query:
        if project.project_id not in projectIds:
            projectIds.append(project.project_id)
    return projectIds


""" HARDWARE SET RELATED FUNCTIONS """

def create_hw_set(h_id, name, capacity):
    new_hw_set = Hardware(hardware_id=h_id, name=name,
                          capacity=capacity, available=capacity)
    new_hw_set.save(force_insert=True)
    return

def check_in(hw_set_id, checkin_quantity, username) -> int:
    queryA = Hardware.objects(hardware_id__exact=hw_set_id)
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
    # print(hw_set.capacity)
    if checkin_quantity > int(user.hw_sets[hw_set_id]): 
        #this is if the user tries to check in more than they've checked out
        return 400
    if checkin_quantity > int(hw_set.capacity):
        #this is when a user tries to check in more than capacity
        return 400
    hw_set.available += checkin_quantity
    hw_set.save()     # since the hardware set already existed, this saves the document with the new available quantity
    if hw_set_id not in user.hw_sets or user.hw_sets[hw_set_id] <= 0:
        user.hw_sets[hw_set_id] = 0
        return 400
    user.hw_sets[hw_set_id] -= checkin_quantity
    user.save()
    return 1


def check_out(hw_set_id, checkout_quantity, username):
    queryA = Hardware.objects(hardware_id__exact=hw_set_id)
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
    if hw_set_id not in user.hw_sets or user.hw_sets[hw_set_id] <= 0:
        user.hw_sets[hw_set_id] = 0
    user.hw_sets[hw_set_id] += checkout_quantity
    user.save()
    return 1


def get_capacity_and_available(hw_set):
    return jsonify(capacity=hw_set.capacity, available=hw_set.available)


def does_hw_set_exist(hw_set_id) -> bool:
    query = Hardware.objects(hardware_id__exact=hw_set_id)
    if len(query) < 1:
        return False  # not found
    hardware_set = query.first()
    if not hardware_set:
        return False  # not found
    if hw_set_id != hardware_set.hardware_id:
        return False  # incorrect id
    return True
