from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent
DEBUG = DEBUG = True if os.getenv('DEBUG') == '1' else False
CORS_ALLOW_ALL_ORIGINS = True
CORS_ORIGIN_ALLOW_ALL = True
APPEND_SLASH = False

CLOSE_CREATE_SECRET = '0639524d5a3a3ede43cb56d0502f50f6'
CLOSE_UPDATE_SECRET = 'a0b7067717616b11256c8ed5e072b8a4'
API_SECRET = '66db232a-9d48-4b9e-98cf-779c929ac4b0'

# SECURITY WARNING: keep the secret key used in production secret!
EAGLE_EYE_TOKEN = os.getenv('EAGLE_EYE_TOKEN')

# GATEKEEPER_URL = 'https://gatekeeper.1337.ma'

GATEKEEPER_SECRET = os.getenv('GATEKEEPER_SECRET')
# GATEKEEPER_SECRET = os.getenv('GATEKEEPER_SECRET')

# SMTP Congigurations
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'no-reply@1337.ma')
EMAIL_HOST = os.getenv('EMAIL_HOST', 'mail.1337.ma')
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', 'no-reply@1337.ma')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', 'iDVgYJ3YH9SJoH9J')
EMAIL_PORT = os.getenv('EMAIL_PORT', 587)
EMAIL_USE_TLS = True

# Web Hooks Emails

TO_EMAIL = []
CC_EMAIL = []

INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework.authtoken',
    'channels',
    'corsheaders',

    'manager.apps.ManagerConfig',
]


if DEBUG:
    SECRET_KEY = 'django-insecure-u9k#w(1kfm%w6pw8ocdo837v8hsr&hu9o+n9*l6wbyyy9w9yom'
    INSTALLED_APPS.append('django.contrib.admin',)
    ALLOWED_HOSTS = ["*"]
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    SECRET_KEY = os.getenv('SECRET_KEY')
    # SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    # SECURE_SSL_REDIRECT = True
    # SESSION_COOKIE_SECURE = True
    # CSRF_COOKIE_SECURE = True
    # SECURE_HSTS_SECONDS = 300
    ALLOWED_HOSTS = ["*"]
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('POSTGRES_DB'),
            'USER': os.getenv('POSTGRES_USER'),
            'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
            'HOST': 'backendDB',
                    'PORT': 5432,
        }
    }
    # allow headers
    CORS_ALLOW_HEADERS = [
        'accept',
        'accept-encoding',
        'x-secret',
    ]

DEFAULT_RENDERER_CLASSES = (
    'rest_framework.renderers.JSONRenderer',
)


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'LeetFood.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'LeetFood.wsgi.application'
ASGI_APPLICATION = "LeetFood.asgi.application"
CHANNEL_LAYERS = {
    'default': {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    },
}

# LeetFood #Logging Information
isExist = os.path.exists(BASE_DIR / 'logs')
if not isExist:
    # Create a new directory because it does not exist
    os.makedirs(BASE_DIR / 'logs')
LOGGING = {
    # Version of logging
    'version': 1,
    # disable logging
    'disable_existing_loggers': False,
    # formatters #############################################################
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {message}',
            'style': '{',
        },
    },
    # Handlers #############################################################
    'handlers': {
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'logs/LeetFood-debug.log',
            'formatter': 'verbose'
        },
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
    },
    # Loggers ####################################################################
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'propagate': True,
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO')
        },
    },
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
# Ramadan Time Zone
# TIME_ZONE = 'America/Eirunepe' 

TIME_ZONE = 'Africa/Casablanca'

USE_I18N = True

USE_TZ = True


STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
