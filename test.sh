#!/bin/sh

pytest -rA

mongo web-app --eval "db.dropDatabase()"