"""
Tests for hardware model
"""
from api import app as myApp
from tests import simplicity_test
# from tests import test
import json
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, verify_jwt_in_request


#chck hardware
# returns all hardware info (about sets)
@simplicity_test
def test_initial_hardware(client, request):
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
    res = client.post('/api/checkHardware', headers=headers, json=user_data)
    resData = res.get_json()
    print(resData.get("data"))
    assert res.status_code == 200
    assert len(resData.get("data")) == 2 # we have 2 hardware sets inititally

#create HW
#create hw set
@simplicity_test
def test_create_hardware_set(client, request):
    user_data = {
        "username": "test_new_user",
        "id": "hw3",
        "name": "Hardware Set 3",
        "capacity": "512",
        "price": ".50"
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.post('/api/createHW', headers=headers, json=user_data)
    resData = res.get_json()
    print(resData.get("data"))
    assert res.status_code == 200

@simplicity_test
def test_checkHardware_after_create_hardware_set(client, request):
    user_data = {
        "username": "test_new_user",
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.post('/api/checkHardware', headers=headers, json=user_data)
    resData = res.get_json()
    print(resData.get("data"))
    assert res.status_code == 200
    assert len(resData.get("data")) == 3 # we just created a new hw set

# checkOutHardware
#checks out hardware and assigns it to user or project
@simplicity_test
def test_checkout_hardware_to_user(client, request):
    user_data = {
        "username": "test_new_user",
        "id": "hwSetA",
        "quantity": "10",
        "usage": "personal"
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.post('/api/checkOutHardware', headers=headers, json=user_data)
    resData = res.get_json()
    print(resData.get("data"))
    assert res.status_code == 200 #checked out hw to user 

@simplicity_test
def test_checkout_hardware_to_project(client, request):
    user_data = {
        "username": "test_new_user",
        "username": "test_new_user",
        "id": "hwSetA",
        "project_id": "p2",
        "quantity": "10",
        "usage": "shared"
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.post('/api/checkOutHardware', headers=headers, json=user_data)
    resData = res.get_json()
    print(resData.get("data"))
    assert res.status_code == 200  # checked out to project 
#checkInHardware
# checks in hardware and gives bill

@simplicity_test
def test_checkin_hardware_from_user(client, request):
    user_data = {
        "username": "test_new_user",
        "username": "test_new_user",
        "id": "hwSetA",
        "project_id": "p2",
        "quantity": "10",
        "usage": "personal"
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.post('/api/checkInHardware', headers=headers, json=user_data)
    resData = res.get_json()
    print(resData.get("data"))
    assert res.status_code == 200 

@simplicity_test
def test_checkin_hardware_from_project(client, request):
    user_data = {
        "username": "test_new_user",
        "username": "test_new_user",
        "id": "hwSetA",
        "project_id": "p2",
        "quantity": "10",
        "usage": "shared"
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.post('/api/checkInHardware', headers=headers, json=user_data)
    resData = res.get_json()
    print(resData.get("data"))
    assert res.status_code == 200 