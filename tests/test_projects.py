
"""
Tests for projects model
"""
from api import app as myApp
from tests import simplicity_test
# from tests import test
import json
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, verify_jwt_in_request

# @test("Hello world test")
#Create 2 projects
@simplicity_test
def test_create_project(client, request):
    user_data = {
        "username": "test_new_user",
        "name": "testProject",
        "id": "p1",
        "desc": "Test description"
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.post('/api/createProject', headers=headers, json=user_data)
    print(res.data)
    assert res.status_code == 200

@simplicity_test
def test_create_another_project(client, request):
    user_data = {
        "username": "regUser2",
        "name": "regUser Project",
        "id": "p2",
        "desc": "Test description 2"
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.post('/api/createProject', headers=headers, json=user_data)
    print(res.data)
    assert res.status_code == 200

#Check if we get projects by id (2 of them)

#join each other's projects

#edit project 1 with user 2

#check if user 1 can see it

#delete both pictures


#TODO: Check if admin can view project

#TODO: Need second user so we can test join project

    