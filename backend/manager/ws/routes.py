from django.urls import path
from .consumers import ManagerConsumer


websocket_urlpatterns = [
    path('ws/manager', ManagerConsumer.as_asgi()),
]