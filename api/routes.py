"""
FILE: app/routes.py

This file will contain decorators and their functions
"""

from flask import flash, redirect, render_template, url_for, request
from .__init__ import app, db
from .forms import LoginForm, RegistrationForm
from .models import Hardware, Project, User, create_user
from flask import jsonify
from flask_login import current_user, login_user, logout_user, login_required


# hello

@app.route('/')
@app.route('/home')
def home():
    # TODO: Render homepage

    # Mock homepage below
    user = {'username': 'Sylvia'}

    return jsonify(user)
    


@app.route('/register', methods=['GET', 'POST'])
def register():
    # TODO: Render registration page
    # TODO: Implement OAuth
    """ Fair warning: Internal Server Error will occur if you try to submit a registration form """
    if current_user.is_authenticated:
        return redirect(url_for('home'))        # redirect logged-in users for now --> this can change to a user portal later
    form = RegistrationForm()
    if form.validate_on_submit():
        create_user(form.username.data, form.email.data, form.password.data)
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    
    return render_template('register.html', title='Register', form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    # TODO: Render login page
    # TODO: Implement OAuth 
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    # Mock login page below
    form = LoginForm()      # instantiate object from LoginForm class

    if form.validate_on_submit():       # process form; if nothing is submitted, a blank login page will render
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.remember_me.data))
        return redirect(url_for('home'))

    return render_template('login.html', title='Sign In', form=form)


@app.route('/projects', methods=['GET', 'POST'])
def projects():
    pass





    

