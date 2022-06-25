import os
from waitress import serve
from api import app

IP = str(os.environ.get('IP', '0.0.0.0'))
PORT = int(os.environ.get('PORT', 3017))

if __name__ == "__main__":
    serve(app, host=IP, port=PORT)