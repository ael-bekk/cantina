# deployment/backend/Dockerfile

FROM python:3.8.3-alpine

WORKDIR /app

RUN apk update && \
    apk add --virtual python-dev && \
    apk add --virtual build-deps gcc musl-dev && \
    apk add postgresql-dev && \
    apk add tzdata
RUN apk add libffi-dev openssl-dev cargo
RUN apk add jpeg-dev zlib-dev
RUN pip install --upgrade pip
RUN pip install psycopg2 psycopg2-binary
ADD ./backend/requirements.txt /app/backend/
RUN pip install -r backend/requirements.txt

ADD ./deployment /app/deployment
ADD ./backend /app/backend
EXPOSE 8000
RUN ["chmod", "+x", "/app/deployment/backend/asgi-entrypoint.sh"]
