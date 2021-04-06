"""
FILE: app/routes.py

This file will contain decorators and their functions
"""

from flask import flash, redirect, render_template, url_for
from app import app
from app.forms import LoginForm
from flask_login import current_user, login_user, logout_user, login_required


@app.route('/')
@app.route('/home')
def home():
    # TODO: Render homepage

    # Mock homepage below
    user = {'username': 'Sylvia'}

    return render_template('home.html', title='Home', user=user)        # Jinja2 substitutes {{ ... }} in the templates with the parameters here
    


@app.route('/register')
def register():
    # TODO: Render registration page
    # TODO: Implement OAuth
    
    
    return "This is the registration page!"


@app.route('/login', methods=['GET', 'POST'])
def login():
    # TODO: Render login page
    # TODO: Implement OAuth 
    
    # Mock login page below
    form = LoginForm()      # instantiate object from LoginForm class

    if form.validate_on_submit():       # process form; if nothing is submitted, a blank login page will render
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.remember_me.data))
        return redirect(url_for('home'))

    return render_template('login.html', title='Sign In', form=form)
    

