#!/bin/sh

pytest tests/test_users.py tests/test_projects.py -rA

mongo web-app --eval "db.dropDatabase()"