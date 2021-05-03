
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


# DONE: Need second user so we can test join project

#Check if we get projects by id (2 of them)

@simplicity_test 
def test_get_first_project(client, request):
    user_data = {
        "username": "regUser2",
        "id": "p1",
        "delete": False,
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.get('/api/projects', headers=headers, query_string=user_data)
    print(res.data)
    assert res.status_code == 200


#join project
@simplicity_test
def test_join_first_project(client, request):
    user_data = {
        "username": "regUser2",
        "id": "p1",
        "delete": False,
    }
    access_token = create_access_token(identity=user_data.get("username"))
    print(access_token)
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.post('/api/joinProject', headers=headers, json=user_data)
    print(res.data)
    assert res.status_code == 200

# edit shared project
@simplicity_test
def test_edit_first_project(client, request):
    user_data = {
        "username": "regUser2",
        "name": "new project name",
        "id": "p1",
        "desc": "This is a new description"
    }
    access_token = create_access_token(identity=user_data.get("username"))
    print(access_token)
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.post('/api/editProject', headers=headers, json=user_data)
    print(res.data)
    assert res.status_code == 200

# get shared project original user to see changes
@simplicity_test 
def test_get_edited_project(client, request):
    user_data = {
        "username": "test_new_user",
        "id": "p1",
        "delete": False,
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.get('/api/projects', headers=headers, query_string=user_data)
    resData = res.get_json()
    print(res.data)
    assert res.status_code == 200
    assert resData.get("projectName") == "new project name" #making sure we can see the changes

#delete shared project
@simplicity_test 
def test_delete_shared_project(client, request):
    user_data = {
        "username": "test_new_user",
        "id": "p1",
        "delete": "true", 
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.get('/api/projects', headers=headers, query_string=user_data)
    resData = res.get_json()
    print(res.data)
    assert res.status_code == 200 #user deleted project


#show deleted in original user 
@simplicity_test 
def test_show_project_was_deleted(client, request):
    user_data = {
        "username": "regUser2",
        "id": "p1",
        "delete": False,
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.get('/api/projects', headers=headers, query_string=user_data)
    resData = res.get_json()
    print(res.data)
    assert res.status_code == 404 #shared users cannot find deleted project 
