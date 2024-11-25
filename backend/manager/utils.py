import requests
import json
import logging
from . import configs
from .database import DATABASE
from pathlib import Path
from .models import Person
from .api.serializers import PersonSerializer
from channels.db import database_sync_to_async

BASE_DIR = Path(__file__).resolve().parent.parent

# Global Variables
BREAKFAST = "breakfast"
LUNCH = "lunch"
DINNER = "dinner"


def request_token():
    auth_server_url = configs.uri
    client_id = configs.client
    client_secret = configs.secret
    token_req_payload = {'grant_type': 'client_credentials'}

    token_response = requests.post(auth_server_url, data=token_req_payload,
                                   verify=False, allow_redirects=False, auth=(client_id, client_secret))

    if token_response.status_code != 200:
        print("Failed to obtain token from the OAuth 2.0 server")
    else:
        print("Successfuly obtained a new token")
        tokens = json.loads(token_response.text)
        return tokens['access_token']


def solo_to_json(object):
    return {
        'name': object.name,
        'start': object.start_time,
        'end': object.end_time,
        'is_active': object.is_active,
    }

# Get User Info from JSON Database
# def search(key, value):
# 	for user in DATABASE:
# 		if user.get(key, None) == value:
# 			return user
# 	return None


# Get User Info from POSTGRESQL Database


def search(key, value):
    try:
        if key == 'badge':
            return PersonSerializer(instance=Person.objects.get(badge=value)).data
        elif key == 'login':
            return PersonSerializer(instance=Person.objects.get(login=value)).data
    except Person.DoesNotExist:
        return None
    return None


@database_sync_to_async
def get_user_info(login=None, badge=None):
    if badge:
        badge = str(badge).lstrip("0")
        res = search("badge", badge)
    else:
        # res = search("login", login)
        logging.warning(f"Using login to get user info is deprecated. Use badge instead.")
        return False, None

    try:
        # User Not Found Case
        if res == None:
            logging.warning(f"User (LOGIN:{login} / BADGE:{badge}) Not Found")
            return False, None

        # User Not Authorized
        if res['authorized'] == False or str(res['authorized']).upper() == "FALSE":
            logging.warning(f"User (LOGIN:{login} / BADGE:{badge}) Not Authorized")
            return False, res
        elif res['authorized'] == True or str(res['authorized']).upper() == "TRUE":
            res['badge'] = str(res['badge']).lstrip("0")
            res['first_name'] = res['full_name'].split(" ")[0]
            res['last_name'] = " ".join(res['full_name'].split(" ")[1:])
            res['response'] = res['authorized']
            res['profile'] = res['kind']
            res['state'] = 'authorized'
            res['image_url'] = "https://cultureamp.design/static/a489d86dba895745f93a8d1268fe713f/avatar.svg"

            # Superuser Case
            if res.get('superuser', False) == True:
                return True, res
            # Normal User Case
            return False, res

    except Exception as e:
        # Endpoint Error Case
        logging.error("GET_USER_INFO: " + str(e))
        return None, None


# async def get_user_info(login=None, badge=None):
#     BASE_URL = "https://pacs.1337.ma/ords/1337/ws/"
#     if badge:
#         BASE_URL = BASE_URL + "check_card/?p_card_id=" + str(badge)
#     else:
#         BASE_URL = BASE_URL + "check_login/?p_login=" + str(login)

#     try:
#         token = request_token()
#         api_call_headers = {'Authorization': 'Bearer ' + token}
#         response = requests.get(
#             url=BASE_URL, headers=api_call_headers, timeout=2)
#         res = json.loads(response.text.encode('utf8'))

#         # User Not Found Case
#         if res['response'] == False and not res.get('login', None):
#             return False, None

#         # User Not Authorized
#         if res['response'] == False and res.get('login', None):
#             return False, False

#         if res['response'] == True:
#             res['badge'] = str(res['badge']).lstrip("0")
#             # Superuser Case
#             if res['superuser'] == True:
#                 return True, res
#             # Normal User Case
#             return False, res
#     except Exception as e:
#         # Endpoint Error Case
#         logging.error(str(e))
#         return None, None
