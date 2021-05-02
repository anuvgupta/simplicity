#!/bin/sh

pytest tests/test_users.py tests/test_projects.py -rA

mongo simplicity-cloud --eval "db.dropDatabase()"