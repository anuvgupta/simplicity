
"""Tests for the users functionality of the API
This includes registration and login
"""
from api import app as myApp
from tests import simplicity_test
# from tests import test
import json


# @test("Hello world test")
@simplicity_test
def test_hello_world(client, request):
    res = client.get('/api')
    # print(res)
    assert b"Simplicity API" in res.data

@simplicity_test
def test_register(client, request):
    res = client.get('/api')
    # print(res)
    assert b"Simplicity API" in res.data
# def test_new_user_as_admin(client):


# def test_register_success(client):
#     user_data = {
#         "first_name": "TestFirstName",
#         "last_name": "TestLastName",
#         "email": "testemail@domain.com",
#         "password": "T3stP@ssword"
#     }
#     res = client.post('/users/register', json=user_data)
#     assert res.status_code == 201
#     assert b"token" in res.data
    

# def test_register_empty_data(client):
#     user_data = {
#         "first_name": "",
#         "last_name": "",
#         "email": "",
#         "password": ""
#     }
#     res = client.post('/users/register', json=user_data)
#     assert res.status_code == 401


# def test_register_invalid_data(client):
#     user_data = {
#         "first_name": "TestFirstName",
#         "last_name": "TestLastName",
#         "email": "invalidemail",
#         "password": "invalidpassword"
#     }
#     res = client.post('/users/register', json=user_data)
#     assert res.status_code == 401
#     user_data["email"] = "validemail@domain.com"
#     user_data["password"] = "1nvalidpassword"
#     res = client.post('/users/register', json=user_data)
#     assert res.status_code == 401
#     user_data["password"] = "1NVALIDPASSWORD"
#     res = client.post('/users/register', json=user_data)
#     assert res.status_code == 401


# def test_register_duplicate(client):
#     user_data = {
#         "first_name": "TestFirstName",
#         "last_name": "TestLastName",
#         "email": "testemail@domain.com",
#         "password": "T3stP@ssword"
#     }
#     User(**user_data).save()
#     res = client.post('/users/register', json=user_data)
#     assert res.status_code == 409


# def test_login_success(client):
#     user_data = {
#         "first_name": "TestFirstName",
#         "last_name": "TestLastName",
#         "email": "testemail@domain.com",
#         "password": "T3stP@ssword"
#     }
#     pw_hash = bcrypt.generate_password_hash(user_data["password"]).decode('utf-8')
#     new_user = User(**user_data)
#     new_user.password = str(pw_hash)
#     new_user.save()
#     res = client.post('/users/login', json={
#         "email": user_data["email"],
#         "password": user_data["password"]
#     })
#     assert res.status_code == 200
#     assert b"token" in res.data


# def test_login_incorrect_password(client):
#     user_data = {
#         "first_name": "TestFirstName",
#         "last_name": "TestLastName",
#         "email": "testemail@domain.com",
#         "password": "T3stP@ssword"
#     }
#     pw_hash = bcrypt.generate_password_hash(user_data["password"]).decode('utf-8')
#     new_user = User(**user_data)
#     new_user.password = str(pw_hash)
#     new_user.save()
#     res = client.post('/users/login', json={
#         "email": user_data["email"],
#         "password": user_data["password"] + "!"
#     })
#     assert res.status_code == 401


# def test_login_empty_data(client):
#     user_data = {
#         "first_name": "",
#         "last_name": "",
#         "email": "",
#         "password": ""
#     }
#     res = client.post('/users/login', json={
#         "email": user_data["email"],
#         "password": user_data["password"]
#     })
#     assert res.status_code == 404


# def test_login_no_account(client):
#     user_data = {
#         "first_name": "TestFirstName",
#         "last_name": "TestLastName",
#         "email": "testemail@domain.com",
#         "password": "T3stP@ssword"
#     }
#     res = client.post('/users/login', json={
#         "email": user_data["email"],
#         "password": user_data["password"]
#     })
#     assert res.status_code == 404