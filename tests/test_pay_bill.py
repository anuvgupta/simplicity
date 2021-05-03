
"""
Tests for Billing model
"""
from api import app as myApp
from tests import simplicity_test
# from tests import test
import json
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, verify_jwt_in_request

#billing
# show users bills
@simplicity_test
def test_initial_bills(client, request):
    user_data = {
        "username": "regUser2",
        "name": "testProject",
        "id": "p1",
        "desc": "Test description"
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.get('/api/billing', headers=headers, query_string=user_data)
    resData = res.get_json()
    print(resData.get("data"))
    billingId = resData.get("bill_id")
    assert res.status_code == 200

#payment
#helps update payment info
@simplicity_test
def test_update_payment_info(client, request):
    user_data = {
        "username": "regUser2",
        "name": "regUser2",
        "card_number": "4024007103939509", # fake number
        "expiration": "07/23", # fake number
        "zipcode": "78705"
    }
    access_token = create_access_token(identity=user_data.get("username"))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    res = client.post('/api/payment', headers=headers, json=user_data)
    resData = res.get_json()
    print(resData.get("data"))
    assert res.status_code == 200

#payBill - wont work because billing id is regenerated each time
# @simplicity_test
# def test_pay_bill(client, request):
    
#     user_data = {
#         "username": "regUser2",
#         "name": "regUser2",
#         "bill_id": "608f4f03c2d806ae6530dafc",
#     }
#     access_token = create_access_token(identity=user_data.get("username"))
#     headers = {
#         'Authorization': 'Bearer {}'.format(access_token)
#     }
#     res = client.post('/api/payBill', headers=headers, json=user_data)
#     resData = res.get_json()
#     print(resData.get("data"))
#     assert res.status_code == 200

#authBillPayment