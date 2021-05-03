#!/bin/bash

echo "SIMPLICITY CLOUD API TESTING"
echo ""
echo "ACTIVATING VENV"
source ./venv/bin/activate
echo ""
echo "RUNNING PYTEST"
pytest tests/test_users.py tests/test_projects.py tests/test_hardware.py tests/test_pay_bill.py -rA
echo ""
echo "CLEARING DATABASE"
mongo simplicity-cloud --eval "db.dropDatabase()"