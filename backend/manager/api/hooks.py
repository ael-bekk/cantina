from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from manager.models import Close, Person, Logs
from django.conf import settings
import logging
from .emailSender import send_access_email
from datetime import datetime
from rest_framework import authentication, permissions
import oracledb

CLOSE_CREATE_SECRET = settings.CLOSE_CREATE_SECRET
CLOSE_UPDATE_SECRET = settings.CLOSE_UPDATE_SECRET
API_SECRET = settings.API_SECRET

BH_END = 0
FREEZE_END = 1
FREEZE_START = 2


DB_USER = 'concierge'
DB_PASSWORD = '_02A1bsGE__g_lhMalf0ag__'
DB_DSN = '10.23.1.168:1521/XEPDB1'


def initiate_connection():
    connection = oracledb.connect(user=DB_USER, password=DB_PASSWORD, dsn=DB_DSN)
    print("Connection established, Database version is", connection.version)
    return connection



GATEKEEPER_SECRET = settings.GATEKEEPER_SECRET


def get_email_data(reason, user):
    today = datetime.today().strftime('%d/%m/%Y')
    full_name = f"{user.get('first_name', '---').capitalize()} {user.get('last_name', '---').capitalize()}"

    EMAILS_DATA = {
        BH_END: {
            'subject': f'BlackHole: Etudiant {full_name}',
            'message': f"""
Bonjour,

Merci de noter que Monsieur/Madame {full_name} est en BlackHole. Il n est désormais plus étudiant(e) au sein de l'école 1337 à partir d'aujourd'hui {today}.
Nous vous remercions de lui suspendre tout les accès à UM6P/1337

Excellente journée
Scolarité 1337
            """
        },
        FREEZE_START: {
            'subject': f'Suspension d\'accès "Freeze": étudiant {full_name}',
            'message': f"""
Bonjour,

Merci de noter que Monsieur / Madame {full_name} est en FREEZE ( a suspendu ses Etudes ) à partir d'aujourd'hui {today}. Il n a plus accès à  l'école 1337 et à UM6P jusqu’à nouvelle notification

Excellente journée
Scolarité 1337
            """
        },
        FREEZE_END: {
            'subject': f'Autorisation d\'accès "Fin de Freeze": étudiant {full_name}',
            'message': f"""
Bonjour,

Merci de noter que Monsieur / Madame {full_name} a fini son FREEZE. Il peut désormais reprendre ses études à partir d'aujourd'hui {today}. Merci d'autoriser son accès à l'école 1337 et à UM6P

Excellente journée
Scolarité 1337
            """
        },
    }
    return EMAILS_DATA.get(reason, None)


class HookCloseCreateView(APIView):
    """
    Handles the close hook from the Intra
    """

    def post(self, request):
        secret = request.headers.get('X-Secret', None)
        if secret != CLOSE_CREATE_SECRET:
            return Response({'detail': 'Invalid Secret Token'}, status=status.HTTP_403_FORBIDDEN)
        try:
            login = request.data['login']
            reason = request.data['reason']
            kind = request.data['kind']
            state = request.data['state']

            print(login, reason, kind)
            person = Person.objects.get(login=login)
            person.authorized = False
            person.save()
            Close.objects.create(
                login=login,
                reason=reason,
                kind=kind,
                state=state
            )
            return Response({'detail': "Closed successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Close not created': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class HookCloseUpdateView(APIView):
    """
    Handles the close hook from the Intra
    """

    def post(self, request):
        secret = request.headers.get('X-Secret', None)
        if secret != CLOSE_CREATE_SECRET:
            return Response({'detail': 'Invalid Secret Token'}, status=status.HTTP_403_FORBIDDEN)
        try:
            login = request.data['login']
            reason = request.data['reason']
            kind = request.data['kind']
            state = request.data['state']
            print('data === ', login, reason, kind, state)
            person = Person.objects.get(login=login)
            person.authorized = True
            person.save()
            Close.objects.get_or_create(
                login=login,
                reason=reason,
                kind=kind,
                state=state
            )
            return Response({'detail': "Unclosed successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Close Update Hook Failed': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class HookUpdateBadgeId(APIView):
    """
    Handles the update of the badge id 
    """

    def patch(self, request):
        secret = request.headers.get('X-Secret', None)
        if secret != API_SECRET:
            return Response({'detail': 'Invalid Secret Token'}, status=status.HTTP_403_FORBIDDEN)
        try:
            login = request.data['login']
            badge_id = request.data['badge_id']
            person = Person.objects.get(login=login)
            person.badge = badge_id
            person.save()
            return Response({'detail': "Updated successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Person does not updated successfully': str(e)}, status=status.HTTP_400_BAD_REQUEST)



# get all closes
class HookCloseGetView(APIView):
    """
    Handles the close hook from the Intra
    """

    def get(self, request):
        try:
            closes = Close.objects.all().order_by('-id')
            all_closes = []
            for close in closes:
                all_closes.append({
                    'login': close.login,
                    'reason': close.reason,
                    'kind': close.kind,
                    'state': close.state,
                    'id': close.id,
                    'time': close.created_at,
                })
            return Response({'closes': all_closes}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Get closes failed': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# get all logs
class HookLogGetView(APIView):
    """
    get all logs
    """

    def get(self, request):
        try:
            logs = Logs.objects.all().order_by('-id')
            all_logs = []
            for log in logs:
                all_logs.append({
                    'login': log.login,
                    'badge_id': log.badge_id,
                    'kind': log.kind,
                    'time': log.created_at,
                    'meal': log.meal,
                })
            return Response({'logs': all_logs}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Get logs failed': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
# get login from badge_id

class HookLoginGetView(APIView):
    """
    get login from badge_id
    """

    def get(self, request, badge_id):
        secret = request.headers.get('X-Secret', None)
        print('secret', secret)
        if secret != GATEKEEPER_SECRET:
            return Response({'detail': 'Invalid Secret Token'}, status=status.HTTP_403_FORBIDDEN)
        try:
            cursor = initiate_connection().cursor()
            # check if connection is established correctly
            print ("Connection established")
            command = "select * from users where code = '" + badge_id + "'"
            cursor.execute(command)
            res = cursor.fetchone()
            return Response({'data': {
                'login': res[3],
                'first_name': res[1],
                'last_name': res[2],
                'image': res[5],
                'authorized': True if res[7] == 'Activated' else False,
                'kind': res[6]
            }}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)