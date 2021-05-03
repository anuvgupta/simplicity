"""
FILE: app/routes.py
This file will contain decorators and their functions
"""

from flask import flash, jsonify, redirect, render_template, url_for, request
from flask_cors import CORS
from .__init__ import *
from .models import *
from werkzeug.exceptions import BadRequest
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, verify_jwt_in_request


@app.route('/')
def slash():
    return redirect(url_for('api'))


@app.route('/api')
def api():
    return "Simplicity API"


@app.route('/api/home')
def home():
    return redirect(url_for('api'))


@app.route('/api/register', methods=['POST'])
def register():
    try:
        # if parsing fails, BadRequest exception is raised
        register_json = request.get_json()
    except BadRequest:
        return (jsonify({
            'success': False,
            'message': 'Invalid request input data.'
        }), 400)
    else:
        new_username = register_json.get('username')
        new_email = register_json.get('email')
        new_password = register_json.get('password')
        if does_user_name_exist(new_username):
            return (jsonify({
                'success': False,
                'message': 'Username already exists. Please choose a different one.'
            }), 409)
        elif does_user_email_exist(new_email):
            return (jsonify({
                'success': False,
                'message': 'Email already exists. Please choose a different one.'
            }), 409)
        else:
            create_user(new_username, new_email, new_password)
            access_token = create_access_token(identity=new_username)
            return (jsonify({
                'success': True,
                'data': {'token': access_token, 'username': new_username, 'first': True}
            }), 200)


@app.route('/api/new_user', methods=['POST'])
@jwt_required()
def new_user():
    current_username = get_jwt_identity()
    user = get_user_obj(current_username)
    if user.is_admin:
        try:
            # if parsing fails, BadRequest exception is raised
            register_json = request.get_json()
        except BadRequest:
            return (jsonify({
                'success': False,
                'message': 'Invalid request input data.'
            }), 400)
        else:
            new_username = register_json.get('username')
            new_email = register_json.get('email')
            new_password = register_json.get('password')
            new_is_admin = register_json.get('is_admin')
            if does_user_name_exist(new_username):
                return (jsonify({
                    'success': False,
                    'message': 'Username already exists. Please choose a different one.'
                }), 409)
            elif does_user_email_exist(new_email):
                return (jsonify({
                    'success': False,
                    'message': 'Email already exists. Please choose a different one.'
                }), 409)
            else:
                if not user.is_godmin:
                    print("User wasn't god user")
                    new_is_admin = False
                create_user(new_username, new_email,
                            new_password, [], new_is_admin, False)
                # access_token = create_access_token(identity=new_username)
                return (jsonify({
                    'success': True,
                    'data': {'username': new_username, 'first': True, 'is_admin': new_is_admin}
                }), 200)


@app.route('/api/login', methods=['POST'])
def login():
    try:
        login_json = request.get_json()
    except BadRequest:
        return (jsonify({
            'success': False,
            'message': 'Invalid request input data.'
        }), 400)
    else:
        username = login_json.get('username')
        password = login_json.get('password')
        verify_code = verify_login(username, password)
        if verify_code == 1:
            access_token = create_access_token(identity=username)
            return (jsonify({
                'success': True,
                'data': {'token': access_token, 'username': username, 'first': False}
            }), 200)  # after the access token has been sent out, front end should redirect to '/account' or '/home'
        elif verify_code == 404:
            return (jsonify({
                'success': False,
                'message': 'User not found.'
            }), 404)
        elif verify_code == 401:
            return (jsonify({
                'success': False,
                'message': 'Incorrect username or password.'
            }), 401)
    return (jsonify({
        'success': False,
        'message': 'Unknown error.'
    }), 500)


@app.route('/api/auth', methods=['GET'])
@jwt_required()
def auth():
    current_username = get_jwt_identity()
    if current_username and does_user_name_exist(current_username):
        return (jsonify({
            'success': True,
            'data': {'username': current_username}
        }), 200)
    return (jsonify({
        'success': False,
        'message': 'Invalid user.'
    }), 401)


@app.route('/api/user', methods=['GET'])
@jwt_required()
def user():
    current_username = get_jwt_identity()
    username = request.args.get('username')
    if username:
        if current_username and username == current_username:
            user = get_user_obj(username)
            if user:
                proj_list = user.projectList
                if user.is_admin or user.is_godmin:
                    proj_list = get_project_ids()
                # print(proj_list)
                proj_hw_usage_obj = {}
                projectHWusage = request.args.get('projectHWusage')
                if projectHWusage and (projectHWusage == 'true' or projectHWusage == True):
                    result = get_proj_hw_usage(user.username)
                    if result[0]:
                        proj_hw_usage_obj = result[0]
                    else:
                        print(result[1])
                payment_rep = ""
                if user.payment_set:
                    payment_rep = (
                        "Card *{}").format(user.payment_method['card_number'][-4:])
                return (jsonify({
                    'success': True,
                    'data': {
                        'username': user.username,
                        'email': user.email,
                        'projectList': proj_list,
                        'hw_sets': user.hw_sets,
                        'is_admin': user.is_admin,
                        'is_godmin': user.is_godmin,
                        'navColor':  user.navColor,
                        'proj_hw_usage': proj_hw_usage_obj,
                        'payment_set': user.payment_set,
                        'payment_rep': payment_rep
                    }
                }), 200)
            return (jsonify({
                'success': False,
                'message': 'User not found.'
            }), 404)
        return (jsonify({
            'success': False,
            'message': 'Unauthorized access.'
        }), 401)
    return (jsonify({
        'success': False,
        'message': 'Invalid request input data.'
    }), 400)


@app.route('/api/getNumUsers', methods=['POST'])
@jwt_required()
def getNumUsers():
    current_username = get_jwt_identity()
    if not current_username:
        return (jsonify({
            'success': False,
            'message': 'Invalid token.'
        }), 401)

    query = User.objects()

    if not query:
        return (jsonify({
            'success': False,
            'message': 'Users not found.'
        }), 404)
    else:
        print(query.count())
        return (jsonify({
            'success': True,
            'data': query.count()
        }), 200)
    return (jsonify({
        'success': False,
        'message': 'Unknown error.'
    }), 500)


@app.route('/api/setUserTheme', methods=['POST'])
@jwt_required()
def setUserTheme():
    current_username = get_jwt_identity()
    if not current_username:
        return (jsonify({
            'success': False,
            'message': 'Invalid token.'
        }), 401)
    user = get_user_obj(current_username)
    if not user:
        return (jsonify({
            'success': False,
            'message': 'Users not found.'
        }), 404)
    try:
        color_json = request.get_json()
    except BadRequest:
        return (jsonify({
            'success': False,
            'message': 'Invalid request input data.'
        }), 400)
    else:
        print(color_json.get("color"))
        set_user_theme(current_username, color_json.get("color"))
        return (jsonify({
            'success': True,
            'data': color_json.get("color")
        }), 200)
    return (jsonify({
        'success': False,
        'message': 'Unknown error.'
    }), 500)


@app.route('/api/update_user', methods=['POST'])
@jwt_required()
def updateUser():
    current_username = get_jwt_identity()
    if not current_username:
        return (jsonify({
            'success': False,
            'message': 'Invalid token.'
        }), 401)
    try:
        new_user_json = request.get_json()
    except BadRequest:
        return (jsonify({
            'success': False,
            'message': 'Invalid request input data.'
        }), 400)
    else:
        new_username = new_user_json.get("username")
        new_email = new_user_json.get("email")
        new_password = new_user_json.get("password")
        current_password = new_user_json.get("curPassword")
        isAdmin = new_user_json.get("is_admin")
        result = update_user(current_username, current_password,
                             new_username, new_email, new_password, isAdmin)
        if result[0] == True:
            return (jsonify({
                'success': True,
                'message': 'User successfully updated'
            }), 200)
        return (jsonify({
            'success': False,
            'message': 'Database update error. ' + result[1]
        }), 500)
    return (jsonify({
        'success': False,
        'message': 'Unknown error.'
    }), 500)


@ app.route('/api/projects', methods=['GET'])
@jwt_required()
def project():
    current_username = get_jwt_identity()
    projectId = request.args.get('id')
    deleteProject = request.args.get('delete')
    if projectId:
        if deleteProject and deleteProject == 'true':
            result = delete_project(projectId, current_username)
            success = result[0]
            message = result[1]
            return (jsonify({
                'success': success,
                'message': 'Project deleted.' if success else ('Failed to delete project. ' + message)
            }), 200)
            # return (True, 200)
        else:
            # print(projectId)
            
            project = get_project_json(projectId)
            if project == None:
                return (jsonify({
                    'success': False,
                    'message': 'projectId not found'
                }), 404)
            # user.projectList
            # print(user['username'])
            # print(project)
            return (project, 200)
    return (jsonify({
        'success': False,
        'message': 'Username not provided.'
    }), 500)


@app.route('/api/createProject', methods=['POST'])
@jwt_required()
def createProject():
    current_username = get_jwt_identity()
    if not current_username:
        return (jsonify({
            'success': False,
            'message': 'Invalid token.'
        }), 401)
    try:
        project_json = request.get_json()
    except BadRequest:
        return (jsonify({
            'success': False,
            'message': 'Invalid request input data.'
        }), 400)
    else:
        project_name = project_json.get('name')
        project_id = project_json.get('id')
        project_description = project_json.get('desc')
        if does_project_id_exist(project_id):
            return (jsonify({
                'success': False,
                'message': 'Project ID already exists.'
            }), 409)
        else:
            create_project(project_name, project_id,
                           project_description, current_username)
            return (jsonify({
                'success': True,
                'data': {
                    'name': project_name,
                    'id': project_id,
                    'desc': project_description
                }
            }), 200)
    return (jsonify({
        'success': False,
        'message': 'Unknown error.'
    }), 500)


@app.route('/api/joinProject', methods=['POST'])
@jwt_required()
def joinProject():
    current_username = get_jwt_identity()
    if not current_username:
        return (jsonify({
            'success': False,
            'message': 'Invalid token.'
        }), 401)
    try:
        project_json = request.get_json()
    except BadRequest:
        return (jsonify({
            'success': False,
            'message': 'Invalid request input data.'
        }), 400)
    else:
        project_id = project_json.get('id')
        if does_project_id_exist(project_id):
            project_obj = get_project_obj(project_id)
            user = get_user_obj(current_username)
            print(user)
            if user:
                # check if user has already joined this project
                if user_already_joined(project_obj, user.username):
                    return jsonify({
                        'success': False,
                        'message': 'User is already a member of this project.'
                    })
                # add user to project and add project to user's projectList
                project_obj.members.append(user.username)
                project_obj.save()

                user.projectList.append(project_id)
                user.save()
                return (jsonify({
                    'success': True,
                    'message': 'Added existing project'
                }), 200)
            else:
                return (jsonify({
                    'success': False,
                    'message': "User not found."
                }), 500)
        else:
            # create_project(project_name, project_id, project_description)
            print("oh no")
            return (jsonify({
                'success': False,
                'message': "Couldn't find this project"
            }), 404)
    return (jsonify({
        'success': False,
        'message': 'Unknown error.'
    }), 500)


@app.route('/api/editProject', methods=['POST'])
@jwt_required()
def editProject():
    current_username = get_jwt_identity()
    if not current_username:
        return (jsonify({
            'success': False,
            'message': 'Invalid token.'
        }), 401)
    try:
        project_json = request.get_json()
    except BadRequest:
        return (jsonify({
            'success': False,
            'message': 'Invalid request input data.'
        }), 400)
    else:
        project_name = project_json.get('name')
        project_id = project_json.get('id')
        project_description = project_json.get('desc')
        if not does_project_id_exist(project_id):
            return (jsonify({
                'success': False,
                'message': 'Project not found.'
            }), 404)
        else:
            update_project(project_name, project_id, project_description)
            return (jsonify({
                'success': True,
                'data': {
                    'name': project_name,
                    'id': project_id,
                    'desc': project_description
                }
            }), 200)
    return (jsonify({
        'success': False,
        'message': 'Unknown error.'
    }), 500)


@app.route('/api/checkHardware', methods=['POST'])
@jwt_required()
def checkHardware():
    current_username = get_jwt_identity()
    if not current_username:
        return (jsonify({
            'success': False,
            'message': 'Invalid token.'
        }), 401)

    hardware_dict = dict()
    query_hardware = Hardware.objects()

    if not query_hardware:
        return (jsonify({
            'success': False,
            'message': 'Hardware not found.'
        }), 404)
    else:
        for hw in query_hardware:
            hardware_dict[hw.hardware_id] = {
                'hardware_id': hw.hardware_id,
                'available': hw.available,
                'name': hw.name,
                'capacity': hw.capacity,
                'price': float(hw.price)
            }
        print(hardware_dict)
        return (jsonify({
            'success': True,
            'data': hardware_dict
        }), 200)
    return (jsonify({
        'success': False,
        'message': 'Unknown error.'
    }), 500)


@app.route('/api/createHW', methods=['POST'])
@jwt_required()
def createHW():
    current_username = get_jwt_identity()
    if not current_username:
        return (jsonify({
            'success': False,
            'message': 'Invalid token.'
        }), 401)
    try:
        hw_set_json = request.get_json()
    except BadRequest:
        return (jsonify({
            'success': False,
            'message': 'Invalid request input data.'
        }), 400)
    else:
        hw_set_id = hw_set_json.get('id')
        hw_set_name = hw_set_json.get('name')
        hw_set_capacity = hw_set_json.get('capacity')
        hw_set_price = hw_set_json.get('price')
        if does_hw_set_exist(hw_set_id):
            return (jsonify({
                'success': False,
                'message': 'Hardware Set already exists.'
            }), 409)
        else:
            create_hw_set(hw_set_id, hw_set_name,
                          hw_set_capacity, hw_set_price)
            return (jsonify({
                'success': True,
                'data': {
                    'name': hw_set_name,
                    'id': hw_set_id
                }
            }), 200)
    return (jsonify({
        'success': False,
        'message': 'Unknown error.'
    }), 500)


@app.route('/api/checkInHardware', methods=['POST'])
@jwt_required()
def checkInHardware():
    def hw_response_400(): return jsonify({
        'success': False,
        'message': 'Bad request.'
    })

    def hw_response_400_alt(): return jsonify({
        'success': False,
        'message': 'Invalid check-in quantity.'
    })

    def hw_response_404(): return jsonify({
        'success': False,
        'message': 'Hardware set not found.'
    })

    def hw_response_500(): return jsonify({
        'success': False,
        'message': 'Unknown error.'
    })
    current_username = get_jwt_identity()
    if not current_username:
        return (jsonify({
            'success': False,
            'message': 'Invalid token.'
        }), 401)
    try:
        hardware_json = request.get_json()
    except BadRequest:
        return (hw_response_400(), 400)
    else:
        hardware_id = hardware_json.get('id')
        checkin_quantity = hardware_json.get('quantity')
        if checkin_quantity:
            checkin_quantity = int(checkin_quantity)
            if checkin_quantity <= 0:
                return (hw_response_400_alt(), 400)
        else:
            return (hw_response_400_alt(), 400)
        if not does_hw_set_exist(hardware_id):
            return (hw_response_404(), 404)
        usage = "personal" if hardware_json.get(
            'usage') == "personal" else "shared"
        ret_val = 0
        project_id = None
        if usage == "personal":
            # check in from user
            ret_val = user_check_in(
                hardware_id, checkin_quantity, current_username)
        else:
            # check in from project
            project_id = hardware_json.get('project_id')
            if not does_project_id_exist(project_id):
                return (jsonify({
                    'success': False,
                    'message': 'Project ' + project_id + ' not found.'
                }), 404)
            ret_val = project_check_in(
                hardware_id, checkin_quantity, project_id)
        if ret_val == 400:
            return (jsonify({
                'success': False,
                'message': 'Checking in more than you have.'
            }), 400)
        elif ret_val == 404:
            return (hw_response_404(), 404)
        elif ret_val == 500:
            return (hw_response_500(), 500)
        new_bill_id = create_bill(
            hardware_id, project_id, checkin_quantity, current_username)
        if new_bill_id == False:
            return (jsonify({
                'success': False,
                'message': "Error creating/processing bill, but check-in completed."
            }), 500)
        return (jsonify({
            'success': True,
            'data': {
                "bill_id": new_bill_id
            }
        }), 200)
    return (hw_response_500(), 500)


@app.route('/api/checkOutHardware', methods=['POST'])
@jwt_required()
def checkOutHardware():
    def hw_response_400(): return jsonify({
        'success': False,
        'message': 'Bad request.'
    })

    def hw_response_400_alt(): return jsonify({
        'success': False,
        'message': 'Invalid check-out quantity.'
    })

    def hw_response_404(): return jsonify({
        'success': False,
        'message': 'Hardware set not found.'
    })

    def hw_response_500(): return jsonify({
        'success': False,
        'message': 'Unknown error.'
    })
    current_username = get_jwt_identity()
    if not current_username:
        return (jsonify({
            'success': False,
            'message': 'Invalid token.'
        }), 401)
    try:
        hardware_json = request.get_json()
    except BadRequest:
        return (hw_response_400(), 400)
    else:
        hardware_id = hardware_json.get('id')
        checkout_quantity = hardware_json.get('quantity')
        if checkout_quantity:
            checkout_quantity = int(checkout_quantity)
            if checkout_quantity <= 0:
                return (hw_response_400_alt(), 400)
        else:
            return (hw_response_400_alt(), 400)
        if not does_hw_set_exist(hardware_id):
            return (hw_response_404(), 404)
        usage = "personal" if hardware_json.get(
            'usage') == "personal" else "shared"
        ret_val = 0
        if usage == "personal":
            # checkout to user
            ret_val = user_check_out(
                hardware_id, checkout_quantity, current_username)
        else:
            # checkout to project
            project_id = hardware_json.get('project_id')
            if not does_project_id_exist(project_id):
                return (jsonify({
                    'success': False,
                    'message': 'Project not found.'
                }), 404)
            ret_val = project_check_out(
                hardware_id, checkout_quantity, project_id)
        if ret_val == 400:
            return (jsonify({
                'success': False,
                'message': 'Checking out more than available.'
            }), 400)
        elif ret_val == 404:
            return (hw_response_404(), 404)
        elif ret_val == 500:
            return (hw_response_500(), 500)
        return (jsonify({
            'success': True,
            'data': {}
        }), 200)
    return (hw_response_500(), 500)


@app.route('/api/hardware', methods=['GET', 'POST'])
@jwt_required()
def hardware():
    pass


@app.route('/api/datasets', methods=['GET', 'POST'])
@jwt_required()
def datasets():
    pass


# billing page allows users to update payment info and shows all of their bills
# bills show their unique id's and amount due for that user
@app.route('/api/billing', methods=['GET'])
@jwt_required()
def billing():
    current_username = get_jwt_identity()
    if not current_username:
        return(jsonify({
            'success': False,
            'message': 'Invalid token.'
        }), 401)
    query_user_bills = Bill.objects(recipient_username__exact=current_username)
    if len(query_user_bills) < 1:
        return (jsonify({
            'success': True,
            'message': 'User currently has no bills.',
            'data': {}
        }), 200)
    else:
        bills_dict = dict()
        for bill in query_user_bills:
            bills_dict[str(bill.id)] = bill_obj_to_dict(bill)
        return (jsonify({
            'success': True,
            'data': bills_dict
        }), 200)
    return (jsonify({
        'success': False,
        'message': 'Unknown error.'
    }), 400)


# after user clicks button to update payment
@app.route('/api/payment', methods=['POST'])
@jwt_required()
def payment():
    def bill_response_10(): return jsonify({
        'success': False,
        'message': 'Invalid card number.'
    })
    # bill_response_11 = lambda : jsonify({
    #     'success': False,
    #     'message': 'Invalid CVV.'
    # })

    def bill_response_12(): return jsonify({
        'success': False,
        'message': 'Invalid Expiration Date.'
    })

    def bill_response_13(): return jsonify({
        'success': False,
        'message': 'Invalid Zip Code.'
    })
    current_username = get_jwt_identity()
    if not current_username:
        return(jsonify({
            'success': False,
            'message': 'Invalid token.'
        }), 401)
    # get user payment info
    try:
        payment_json = request.get_json()
    except BadRequest:
        return (jsonify({
            'success': False,
            'message': 'Invalid request input data.'
        }), 400)
    else:
        name_on_card = payment_json.get('name')
        card_num = payment_json.get('card_number')
        # cvv = payment_json.get('cvv')
        expiration = payment_json.get('expiration')
        zipcode = payment_json.get('zipcode')
        # return_value = verify_payment_info(name_on_card, card_num, cvv, expiration, zipcode)
        return_value = verify_payment_info(
            name_on_card, card_num, expiration, zipcode)
        if return_value == 10:
            return (bill_response_10(), 406)
        # elif return_value == 11:
        #     return (bill_response_11(), 406)
        elif return_value == 12:
            return (bill_response_12(), 406)
        elif return_value == 13:
            return (bill_response_13(), 406)
        # payment method is verified
        # update_payment_method(current_username, name_on_card, card_num, cvv, expiration, zipcode)
        update_result = update_payment_method(
            current_username, name_on_card, card_num, expiration, zipcode)
        if not update_result[0]:
            return (jsonify({
                'success': False,
                'message': '' + update_result[1]
            }), 500)
        return (jsonify({
            'success': True,
            'data': {}
        }), 200)
    return (jsonify({
        'success': False,
        'message': 'Unknown error.'
    }), 500)


# when user tries to click on a particular bill to pay for it --> confirms bill payment
@app.route('/api/payBill', methods=['POST'])
@jwt_required()
def payBill():
    current_username = get_jwt_identity()
    if not current_username:
        return (jsonify({
            'success': False,
            'message': 'Invalid token.'
        }), 401)
    user = get_user_obj(current_username)
    if not user:
        return (jsonify({
            'success': False,
            'message': 'User not found.'
        }), 404)
    try:
        bill_json = request.get_json()
    except BadRequest:
        return (jsonify({
            'success': False,
            'message': 'Invalid request input data.'
        }), 400)
    else:
        bill_id = bill_json.get('bill_id')
        if not does_bill_exist(bill_id):
            return (jsonify({
                'success': False,
                'message': 'Bill {} not found.'.format(str(bill_id))
            }), 404)
        curr_bill = get_bill_obj(bill_id)
        if curr_bill:
            # don't allow user to pay for bill if they have already paid for it
            if curr_bill.recipient_username != current_username:
                return (jsonify({
                    'success': False,
                    'message': 'Bill does not belong to user.'
                }), 406)
            if curr_bill.bill_paid:
                return (jsonify({
                    'success': False,
                    'message': 'Bill has already been paid by user.'
                }), 406)
            # don't allow user to pay for bill if they have not set their payment method
            if not user.payment_set:
                return (jsonify({
                    'success': False,
                    'message': 'Please set a payment method.'
                }), 406)
            pay_result = pay_bill(bill_id, curr_bill)
            if not pay_result[0]:
                return (jsonify({
                    'success': False,
                    'message': 'Error processing payment. {}'.format(str(pay_result[1]))
                }), 500) 
            paid_timestamp = pay_result[1]
            set_bill_paid(curr_bill, paid_timestamp)
            return (jsonify({
                'success': True,
                'data': bill_obj_to_dict(curr_bill)
            }), 200)
        return (jsonify({
            'success': False,
            'message': 'Bill {} not found.'.format(str(bill_id))
        }), 404)
    return (jsonify({
        'success': False,
        'message': 'Invalid request input data.'
    }), 400)

@app.route('/api/docs', methods=['GET'])
@jwt_required()
def documentation():
    docs_content = ""
    try:
        with open("./README.md", "r") as docs_file:
            docs_content = docs_file.read()
    except:
        return (jsonify({
            'success': False,
            'message': 'Error reading documentation file.'
        }), 500)
    return (jsonify({
        'success': True,
        'message': 'Documentation file read successfully.',
        'data': {
            'docs_content': str(docs_content)
        }
    }), 200)
    