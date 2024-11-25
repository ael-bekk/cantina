from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import sys
import time
from serial.tools import list_ports


# Add PN532 path
# sys.path.append('..')
import PN532

app = Flask(__name__)

cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

# Find the port that the PN532 is connected to
port_name_key = "serial"
port_name = None
for port in list_ports.comports():
    if port_name_key in port.device:
        port_name = port.device
        break

if not port_name:
    raise RuntimeError("PN532 port not found. Please check the connection.")

# Create an instance of the PN532 class
pn532 = PN532.PN532(port_name, 115200)

# Initialize communication with the PN532
pn532.begin()

# Get the firmware version and log it
ic, ver, rev, support = pn532.get_firmware_version()
print('Found PN532 with FW: {0}.{1}'.format(ver, rev))

@app.route('/read_card', methods=['GET'])
def read_card():

    print("Waiting for a card...")

    while True:
        # Read the card
        uid = pn532.read_passive_target()

        # Skip if no card or "no_card" is detected
        if uid is None or uid == "no_card":
            continue

        # Convert UID to a string
        if isinstance(uid, bytes):
            uid_str = int(uid.hex().upper(), 16)
        else:
            uid_str = int(uid.upper(), 16)

        # Return the UID as a JSON response
        return jsonify({"status": "success", "uid": str(uid_str)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5010)