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
from flask_jwt import encode_token


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
    if verify_jwt_in_request(optional=True):
        current_user = get_jwt_identity()
        if does_user_exist(current_user):
            redirect(url_for('account'))

    while True:
        try:
            register_json = request.get_json()      # if parsing fails, BadRequest exception is raised
        except BadRequest:
            register_json = request.get_json()
        else:
            new_username = register_json.get('username')
            new_password = register_json.get('password')

            while does_user_exist(new_username):
                return jsonify({'msg': 'Username already exists. Please choose a different one.'})

            if not does_user_exist(new_username):
                create_user(new_username, new_password)
                break
    
    return redirect(url_for('login'))



@app.route('/api/login', methods=['POST'])
def login():
    if verify_jwt_in_request(optional=True):
        current_user = get_jwt_identity()
        if does_user_exist(current_user):
            redirect(url_for('account'))
    
    while True:
        try:
            login_json = request.get_json()
        except BadRequest:
            login_json = request.get_json()
        else:
            username = login_json.get('username')
            password = login_json.get('password')

            if not verify_login(username, password):
                return jsonify({'msg': 'The username or password is incorrect. Please try again.'})
            
            elif verify_login(username, password):
                access_token = create_access_token(identity=username)
                break
    
    return jsonify({'access_token': access_token})      # after the access token has been sent out, front end should redirect to '/account'



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





    

