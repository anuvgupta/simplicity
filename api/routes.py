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

    # Mock homepage below
    user = {'username': 'Sylvia'}

    return jsonify(user)
    


@app.route('/api/register', methods=['POST'])
def register():
    try:
        register_json = request.get_json()      # if parsing fails, BadRequest exception is raised
    except BadRequest:
        return (jsonify({
            'success': False,
            'message': 'Invalid request input data.'
        }), 400)
    else:
        new_username = register_json.get('username')
        new_email = register_json.get('email')
        new_password = register_json.get('password')
        if does_user_exist(new_username):
            return (jsonify({
                'success': False,
                'message': 'Username already exists. Please choose a different one.'
            }), 409)
        else:
            create_user(new_username, new_email, new_password)
            access_token = create_access_token(identity=username)
            return (jsonify({
                'success': True,
                'data': { 'token': access_token }
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
        if verify_login(username, password):
            access_token = create_access_token(identity=username)
            return (jsonify({
                'success': True,
                'data': { 'token': access_token }
            }), 200)  # after the access token has been sent out, front end should redirect to '/account'
        else:
            return (jsonify({
                'success': False,
                'message': 'Incorrect username or password.'
            }), 401)
    return (jsonify({
        'success': False,
        'message': 'Unknown error.'
    }), 500)


@app.route('/api/account', methods=['GET', 'POST'])
def account():
    pass



@app.route('/api/createProject', methods=['GET', 'POST'])
def createProject():
    pass


@app.route('/api/project', methods=['GET', 'POST'])
def project():
    pass


@app.route('/api/editProject', methods=['GET', 'POST'])
def editProject():
    pass


@app.route('/api/checkHardware', methods=['GET', 'POST'])
def checkHardware():
    pass


@app.route('/api/hardware', methods=['GET', 'POST'])
def hardware():
    pass


@app.route('/api/datasets', methods=['GET', 'POST'])
def datasets():
    pass





    

