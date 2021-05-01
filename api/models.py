"""
FILE: app/models.py
Define elements of the database
TESTER LOGIN:
username: admin
password: admin
"""
from .__init__ import db
import datetime
from decimal import Decimal
from flask import jsonify
import mongoengine as me
import numpy as np
import random
import time
import re
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
    price = me.DecimalField(min_value=0, force_string=True, precision=2)


def init_hardware():
    query = Hardware.objects(hardware_id="hwSetA")
    hwSet1 = query.first()
    if not hwSet1:
        hw1 = Hardware(hardware_id="hwSetA", name="Hardware Set A", capacity=512, available=512, price=4.89)
        hw1.save(force_insert=True)
    query = Hardware.objects(hardware_id="hwSetB")
    hwSet2 = query.first()
    if not hwSet2:
        hw2 = Hardware(hardware_id="hwSetB", name="Hardware Set B", capacity=1024, available=1024, price=2.45)
        hw2.save(force_insert=True)
    # creates a new document, doesn't allow for updates if this document already exists
    return



# defines fields for individual projects
class Project(me.Document):
    name = me.StringField(max_length=50, required=True, unique=False)
    owner = me.StringField(max_length=50, required=True, unique=False)
    project_id = me.StringField(
        max_length=20, required=True, unique=True, validation=_not_empty)
    description = me.StringField(max_length=200)
    members = me.ListField()    # store members by username
    hw_dict = me.DictField()    # map hwset id to quantity checked out


class Bill(me.Document):
    recipient_username = me.StringField(max_length=50, required=True, unique=False)    
    project_id = me.StringField(max_length=20, required=False, unique=False, validation=_not_empty)
    hw_used = me.DictField()    # maps hw_set_name to quantity checked in
    bill_subtotal = me.DecimalField(min_value=0, force_string=True, precision=2)    # store as a string, can also force it to round a certain way if needed
    amount_due = me.DecimalField(min_value=0, force_string=True, precision=2)
    bill_paid = me.BooleanField(default=False)
    timestamp = me.IntField(required=True)
    paid_timestamp = me.IntField(required=False)


# defines fields for user accounts
class User(me.Document):
    username = me.StringField(
        max_length=50, required=True, unique=True, validation=_not_empty)
    email = me.StringField(max_length=50, required=True, unique=True,
                           validation=_not_empty)    # we'll add this back in later
    password = me.StringField(
        max_length=72, required=True, validation=_not_empty)
    projectList = me.ListField()
    # will map hardware-set names to the quantity checked out for personal use
    hw_sets = me.DictField()
    payment_method = me.DictField()    # Keys: 'name_on_card', 'card_number', 'cvv', 'expiration', 'zipcode'
    payment_set = me.BooleanField(default=False)
    bills_list = me.ListField()
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
    if is_admin == False:
        is_godmin = False
    if is_godmin == True:
        is_admin = True
    new_user = User(username=username, email=email, password=pwd, projectList=projectList,
                    hw_sets=hw_set, is_admin=is_admin, is_godmin=is_godmin, navColor="#000000",
                    bills_list=[], payment_set=False, payment_method={})
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

def get_proj_hw_usage(username):
    usage_obj = {}
    queryA = User.objects(username__exact=username)
    if len(queryA) != 1:
        return (None, "User not found.")
    current_user = queryA.first()
    if not current_user:
        return (None, "User not found.")
    if current_user.projectList and len(current_user.projectList) > 0:
        for p_id in current_user.projectList:
            queryB = Project.objects(project_id__exact=p_id)
            if len(queryB) == 1:
                p_obj = queryB.first()
                if p_obj and p_obj.hw_dict:
                    for hw_id in p_obj.hw_dict:
                        if hw_id not in usage_obj:
                            usage_obj[hw_id] = 0
                        usage_obj[hw_id] += p_obj.hw_dict[hw_id]
    return (usage_obj, "")


""" PROJECT-RELATION FUNCTIONS """
# create a new project and save to database
def create_project(name, proj_id, desc, username=""):
    new_project = Project(name=name, project_id=proj_id,
                          description=desc, owner=username, 
                          members=[], hw_dict={})
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
        members_list = []
        members_list.append(username)
        new_project.members = members_list
        new_project.save()
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
    if proj.hw_dict and len(proj.hw_dict) > 0:
        total_shared_usage = 0
        for hw_set_id in proj.hw_dict:
            total_shared_usage += int(proj.hw_dict[hw_set_id])
        if total_shared_usage > 0:
            return (False, "Project contains hardware, check in before deleting.")
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


def get_project_obj(p_id):
    query = Project.objects(project_id__exact=p_id)
    if len(query) != 1:
        return None
    project = query.first()
    if not project:
        return None
    return project


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
        "description": project.description,
        "hw_dict": project.hw_dict
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


def user_already_joined(project_obj, username) -> bool:
    # joinProject already calls does_project_id_exist to check if the project is valid
    # '==' is case sensitive
    for member in project_obj.members:
        if username == member:
            return True
    user_obj = get_user_obj(username)
    for projID in user_obj.projectList:
        if projID == project_obj.project_id:
            return True
    return False
  
    

""" HARDWARE SET RELATED FUNCTIONS """

def create_hw_set(h_id, name, capacity, price):
    new_hw_set = Hardware(hardware_id=h_id, name=name,
                          capacity=capacity, available=capacity, price=price)
    new_hw_set.save(force_insert=True)
    return


def user_check_in(hw_set_id, checkin_quantity, username) -> int:
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
    if hw_set_id not in user.hw_sets or user.hw_sets[hw_set_id] <= 0:
        user.hw_sets[hw_set_id] = 0
        return 400
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
    user.hw_sets[hw_set_id] -= checkin_quantity
    user.save()
    return 1


def project_check_in(hw_set_id, checkin_quantity, p_id):
    queryA = Hardware.objects(hardware_id__exact=hw_set_id)
    if len(queryA) != 1:
        return 404
    hw_set = queryA.first()
    if not hw_set:
        return 404
    queryB = Project.objects(project_id__exact=p_id)
    if len(queryB) != 1:
        return 404
    project = queryB.first()
    if not project:
        return 404
    if hw_set_id not in project.hw_dict or project.hw_dict[hw_set_id] <= 0:
        project.hw_dict[hw_set_id] = 0
        return 400
    # see if check in quantity is greater than capacity checked out to project
    if checkin_quantity > int(project.hw_dict[hw_set_id]):
        return 400
    if checkin_quantity > int(hw_set.capacity):
        return 400
    hw_set.available += checkin_quantity
    hw_set.save()
    project.hw_dict[hw_set_id] -= checkin_quantity
    project.save()
    # TODO: generate bill for each project member
    return 1


def user_check_out(hw_set_id, checkout_quantity, username):
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


def project_check_out(hw_set_id, checkout_quantity, p_id):
    queryA = Hardware.objects(hardware_id__exact=hw_set_id)
    if len(queryA) != 1:
        return 404
    hw_set = queryA.first()
    if not hw_set:
        return 404
    queryB = Project.objects(project_id__exact=p_id)
    if len(queryB) != 1:
        return 404
    project = queryB.first()
    if not project:
        return 404
    if checkout_quantity > hw_set.available:
        return 400
    hw_set.available -= checkout_quantity
    hw_set.save()
    if hw_set_id not in project.hw_dict or project.hw_dict[hw_set_id] <= 0:
        project.hw_dict[hw_set_id] = 0
    project.hw_dict[hw_set_id] += checkout_quantity
    project.save()
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


def get_hw_obj(hw_set_id):
    query_hw = Hardware.objects(hardware_id__exact=hw_set_id)
    if len(query_hw) != 1:
        return None
    hardware = query_hw.first()
    if not hardware:
        return None
    return hardware


""" BILL AND PAYMENT RELATED FUNCTIONS """
def create_bill(hw_set_id, p_id, checkin_quantity, curr_username):
    # determine price based off quantity checked in 
    if not does_hw_set_exist(hw_set_id):
        return False
    hardware = get_hw_obj(hw_set_id)
    if not hardware:
        return False
    subtotal = int(checkin_quantity) * Decimal(hardware.price)
    members = []
    if not p_id:
        # personal bill
        bill_cost_total = subtotal
        members = [curr_username]
    elif p_id:
        # project bill - amount due for this user 
        if not does_project_id_exist(p_id):
            return False
        project = get_project_obj(p_id)
        if not project:
            return False
        num_members = len(project.members)
        user_total = round(subtotal / num_members, 2)
        bill_cost_total = user_total
        members = project.members
    if not does_user_name_exist(curr_username):
        return False
    user_obj = get_user_obj(curr_username)
    if not user_obj:
        return False
    return_bill_id = ""
    for member_username in members:
        if not does_user_name_exist(member_username):
            continue
        member_user_obj = get_user_obj(member_username)
        if not member_user_obj:
            continue
        timestamp = time.time()
        new_bill = Bill(recipient_username=member_username, project_id=p_id,
                        hw_used={ hw_set_id : checkin_quantity },
                        bill_subtotal=str(subtotal),
                        amount_due=str(bill_cost_total),
                        bill_paid=False, timestamp=timestamp,
                        paid_timestamp=-1)
        new_bill.save()
        member_user_obj.bills_list.append(str(new_bill.id))
        member_user_obj.save()
        if member_username == curr_username:
            return_bill_id = str(new_bill.id)
    return return_bill_id


def verify_payment_info(name, card_number, cvv, expiration, zipcode):
    # check card number
    card_num_regex = re.compile(r'^(\d\d\d\d( )?){4}$')
    search_card = card_num_regex.search(card_number)
    if not search_card:
        return 10
    # check cvv
    cvv_regex = re.compile(r'^(\d){3}$')
    search_cvv = cvv_regex.search(cvv)
    if not search_cvv:
        return 11
    # check expiration date
    expiration_regex = re.compile(r'^(\d\d)(/* *)(\d\d)$')
    search_expiration = expiration_regex.search(expiration)
    input_month = int(search_expiration.group(1))
    input_year = int(search_expiration.group(3))
    curr_month = int(datetime.datetime.now().strftime('%m'))
    curr_year = int(datetime.datetime.now().strftime('%y'))
    # credit card is expired
    if input_month < curr_month or input_year < curr_year:
        return 12
    # check zip code
    zip_regex = re.compile(r'^(\d){5}$')
    search_zip = zip_regex.search(zipcode)
    if not search_zip:
        return 13
    
    return 1


def update_payment_method(curr_username, card_name, card_num, cvv, expiration, zipcode):
    user = get_user_obj(curr_username)
    if not user:
        return (jsonify({
            'success': False,
            'message': 'User is not verified.'
        }), 400)
    user.payment_method['name_on_card'] = card_name
    user.payment_method['card_number'] = card_num
    user.payment_method['cvv'] = cvv
    user.payment_method['expiration'] = expiration
    user.payment_method['zipcode'] = zipcode
    user.payment_set = True
    user.save()
    return 


def does_bill_exist(b_id) -> bool:
    query_bill = Bill.objects(id=str(b_id))
    if len(query_bill) != 1:
        return False
    bill = query_bill.first()
    if not bill:
        return False
    if bill.bill_id != b_id:
        return False
    return True
    

def get_bill_obj(b_id):
    query_bill = Bill.objects(id=str(b_id))
    if len(query_bill) != 1:
        return None
    bill = query_bill.first()
    if not bill:
        return None
    return bill
    
    
def set_bill_paid(bill_obj):
    bill_obj.bill_paid = True
    bill_obj.save()
    
def bill_obj_to_dict(bill_obj):
    return {
        'recipient_username': bill_obj.recipient_username,
        'project_id': bill_obj.project_id if ('project_id' in bill_obj) else None,
        'bill_id': str(bill_obj.id),
        'hw_used': bill_obj.hw_used,
        'bill_subtotal': float(bill_obj.bill_subtotal),
        'amount_due': float(bill_obj.amount_due),
        'bill_paid': bill_obj.bill_paid,
        'timestamp': bill_obj.timestamp,
        'paid_timestamp': bill_obj.paid_timestamp
    }