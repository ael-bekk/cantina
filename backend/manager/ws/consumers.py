import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
import datetime
import logging

from .serializers import LogsSerializer
from manager.models import Registry
from manager.models import Logs
from manager.models import Person
from ..utils import get_user_info

EVENT_USER = 'USER'
EVENT_USER_NOT_AUTHORIZED = 'EVENT_USER_NOT_AUTHORIZED'
EVENT_USER_NOT_FOUND = 'USER_NOT_FOUND'
EVENT_USER_ALREADY = 'USER_ALREADY'
EVENT_ENDPOINT_ERROR = 'ENDPOINT_ERROR'
USER_LIMIT_REACHED = 'USER_LIMIT_REACHED'


class ManagerConsumer(AsyncJsonWebsocketConsumer):

    @database_sync_to_async
    # check if user reached the limit
    def limit_reached(self, login, meal):
        today = datetime.datetime.now()
        limit = Person.objects.get(login=login).limit
        # count number of registries for this user
        registries_count = Registry.objects.filter(
            login=login,
            time__year=today.year,
            time__month=today.month,
            time__day=today.day,
            meal=meal
        ).count()
        # check if the user has reached the limit
        if registries_count > limit:
            return True
        return False

    @database_sync_to_async
    def save_logs(self, kind, badge_id, login, meal):
        data = {}
        data['kind'] = kind
        data['badge_id'] = badge_id
        data['login'] = login
        data['meal'] = meal
        serializer = LogsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

    @database_sync_to_async
    def is_exist(self, meal, login):
        today = datetime.datetime.now()
        entries = Registry.objects.filter(
            time__year=today.year,
            time__month=today.month,
            time__day=today.day,
            meal=meal
        )
        if entries.filter(login=login).exists():
            return True
        return False

    async def connect(self):
        print("WebSocket Connected")
        if not isinstance(self.scope['user'], AnonymousUser):
            await self.channel_layer.group_add(
                "manager",
                self.channel_name,
            )
            await self.accept()
        self.close()

    async def disconnect(self, close_code):
        print("WebSocket Desconnected")
        # await self.channel_layer.group_discard(
        #     self.channel_name,
        #     self.channel_name
        # )

    async def receive_json(self, content):
        try:
            is_superuser = False
            user = None

            # LOGIN Method
            if content['event'] == "LOGIN":

                if content['login'].isdigit():
                    is_superuser, user = await get_user_info(badge=content['login'])
                else:
                    is_superuser, user = await get_user_info(login=content['login'])

                if user == None and is_superuser == None:
                    await self.reply({}, EVENT_ENDPOINT_ERROR)

                elif user == None:
                    await self.save_logs("Not found", content['login'], None, content['meal'])
                    await self.reply({}, EVENT_USER_NOT_FOUND)

                elif user['authorized'] == False or str(user['authorized']).upper() == "FALSE":
                    await self.save_logs("Not authorized", user['badge'], user['login'], content['meal'])
                    await self.reply({}, EVENT_USER)

                # check if user reached the limit
                elif (await self.limit_reached(user['login'], content['meal'])):
                    await self.save_logs("Limit reached", user['badge'], user['login'], content['meal'])
                    await self.reply({}, USER_LIMIT_REACHED)

                else:
                    #if content['meal'] == "breakfast" and user['kind'] == "student":
                    #    await self.save_logs("Not authorized", user['badge'], user['login'], content['meal'])
                    #    await self.reply(user, EVENT_USER_NOT_AUTHORIZED)
                    if is_superuser:
                        await self.reply(user, EVENT_USER)
                    else:
                        if (await self.is_exist(content['meal'], login=user['login'])):
                            await self.save_logs("Already badged", content['login'], user['login'], content['meal'])
                            await self.reply({}, EVENT_USER_ALREADY)
                        else:
                            await self.reply(user, EVENT_USER)

        except Exception as e:
            logging.error("Consumer: " + str(e))
            await self.reply({}, EVENT_ENDPOINT_ERROR)

    async def reply(self, res, event):
        await self.send(text_data=json.dumps({
            "event": event,
            "res": res
        }))
