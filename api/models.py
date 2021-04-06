"""
FILE: app/models.py

Define elements of the database
"""

from flask_login import UserMixin
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
    project_id = me.StringField(max_length=20, required=True, unique=True, validation=_not_empty)
    hw_sets = me.DictField()        # will map hardware-set names to the quantity checked out for this project


# defines fields for user accounts
class User(me.Document):
    username = me.StringField(max_length=50, required=True, unique=True, validation=_not_empty)
    password = me.StringField(max_length=50, required=True, validation=_not_empty)
    #password_hash = me.StringField() ==> hash passwords later