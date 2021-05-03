#!/bin/sh

pytest tests/test_users.py tests/test_projects.py tests/test_hardware.py -rA

mongo simplicity-cloud --eval "db.dropDatabase()"