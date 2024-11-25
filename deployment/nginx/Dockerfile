# Copy React static files and start nginx
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*
RUN mkdir -p /usr/share/nginx/logs
COPY ./deployment/nginx/default.config /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]