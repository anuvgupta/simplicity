#!/bin/sh

pytest tests/test_users.py tests/test_projects.py tests/test_hardware.py tests/test_pay_bill.py -rA

mongo simplicity-cloud --eval "db.dropDatabase()"