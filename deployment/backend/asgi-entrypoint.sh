#!/bin/sh

until cd /app/backend/
do
    echo "Waiting for server volume..."
done

until ./manage.py migrate
do
    echo "Waiting for db to be ready..."
    sleep 2
done

# ./manage.py collectstatic --noinput
echo "Creating SuperUser..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser(username='$SUPER_USER_USERNAME', password='$SUPER_USER_PASSWORD') if not User.objects.filter(username='$SUPER_USER_USERNAME').exists() else print('$SUPER_USER_USERNAME already exist.')" | python manage.py shell

daphne -b 0.0.0.0 -p 8000 --ws-protocol "graphql-ws" --proxy-headers LeetFood.asgi:application