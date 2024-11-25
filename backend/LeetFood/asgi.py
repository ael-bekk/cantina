from channels.security.websocket import AllowedHostsOriginValidator
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.http import AsgiHandler
import os
import django
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LeetFood.settings')
django.setup()
django_asgi_app = get_asgi_application()

from manager.ws import routes
from .TokenCheckMiddleware import TokenCheckMiddleware

application = ProtocolTypeRouter({
    "http": AsgiHandler(),
    "websocket": AllowedHostsOriginValidator(
        TokenCheckMiddleware(
            URLRouter(
                routes.websocket_urlpatterns
            )
        ),
    )
})
