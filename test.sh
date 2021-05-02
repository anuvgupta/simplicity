#!/bin/sh

pytest -rA

mongo simplicity-cloud --eval "db.dropDatabase()"