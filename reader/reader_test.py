from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import sys
import time

app = Flask(__name__)

cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/read_card', methods=['GET'])
def read_card():

    print("Waiting for a card...")

    while True:
        # Return the UID as a JSON response
        return jsonify({"status": "success", "uid": "04079F82097B80"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5010)