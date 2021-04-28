"""
FILE: app/routes.py

This file will contain decorators and their functions
"""

from flask import flash, jsonify, redirect, render_template, url_for, request
from flask_cors import CORS
from .__init__ import app, db
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
    # TODO: Render homepage
    # TODO: Check for user authenticated, log into account page or show plain homepage
    # Mock homepage below
    user = {'username': 'Sylvia'}

    return jsonify(user)


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
                'data': {'token': access_token}
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
                'data': {'token': access_token, 'username': username}
            }), 200)  # after the access token has been sent out, front end should redirect to '/account'
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
                if user.is_admin:
                    return (jsonify({
                    'success': True,
                    'data': {
                        'username': user.username,
                        'email': user.email,
                        'projectList': get_project_ids(),
                        'hw_sets': user.hw_sets,
                        'is_admin': user.is_admin,
                        'is_godmin': user.is_godmin
                    }
                }), 200)
                else: 
                    return (jsonify({
                        'success': True,
                        'data': {
                            'username': user.username,
                            'email': user.email,
                            'projectList': user.projectList,
                            'hw_sets': user.hw_sets,
                            'is_admin': user.is_admin,
                            'is_godmin': user.is_godmin
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


@ app.route('/api/projects', methods=['GET'])
@jwt_required()
def project():
    projectId = request.args.get('id')
    if projectId:
        print(projectId)
        project = get_project_json(projectId)
        # user.projectList
        # print(user['username'])
        print(project)
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
            create_project(project_name, project_id, project_description, current_username)
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
            user = get_user_obj(current_username)
            if user:
                #TODO: Check for duplicates
                user.projectList.append(project_id)
                user.save()
                return (jsonify({
                    'success': True,
                    'message': 'Added existing project'
                }), 200)
            else:
                return (jsonify({
                    'success': False,
                    'message': "unknonw"
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
                'name': hw.name
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

@app.route('/api/checkInHardware', methods=['POST'])
@jwt_required()
def checkInHardware():
    hw_response_400 = lambda : jsonify({
        'success': False,
        'message': 'Bad request.'
    })
    hw_response_400_alt = lambda : jsonify({
        'success': False,
        'message': 'Invalid check-in quantity.'
    })
    hw_response_404 = lambda : jsonify({
        'success': False,
        'message': 'Hardware set not found.'
    })
    hw_response_500 = lambda : jsonify({
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
        ret_val = check_in(hardware_id, checkin_quantity, current_username)
        if ret_val == 400:
            return (jsonify({
                'success': False,
                'message': 'Checking in more than you have.'
            }), 400)
        elif ret_val == 404:
            return (hw_response_404(), 404)
        elif ret_val == 500:
            return (hw_response_500(), 500)
        return (jsonify({
            'success': True,
            'data': { }
        }), 200)
    return (hw_response_500(), 500)

@app.route('/api/checkOutHardware', methods=['POST'])
@jwt_required()
def checkOutHardware():
    hw_response_400 = lambda : jsonify({
        'success': False,
        'message': 'Bad request.'
    })
    hw_response_400_alt = lambda : jsonify({
        'success': False,
        'message': 'Invalid check-out quantity.'
    })
    hw_response_404 = lambda : jsonify({
        'success': False,
        'message': 'Hardware set not found.'
    })
    hw_response_500 = lambda : jsonify({
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
        ret_val = check_out(hardware_id, checkout_quantity, current_username)
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
            'data': { }
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
