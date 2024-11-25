FROM node:16.13-alpine3.12 AS build

WORKDIR /app/frontend
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm i
COPY ./frontend/ ./
RUN echo "NEXT_PUBLIC_API_URL=/api/" > .env
RUN echo "NEXT_PUBLIC_WS_URL=ws://cantina/ws/" >> .env
RUN echo "NEXT_PUBLIC_SERVER_API_URL=http://backend:8000/api/" >> .env

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
