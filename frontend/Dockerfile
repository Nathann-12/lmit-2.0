FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package.json ./
RUN npm install --legacy-peer-deps && npm install ajv@^8 --legacy-peer-deps

COPY frontend/ ./

ARG REACT_APP_BACKEND_URL=
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV CI=false
ENV GENERATE_SOURCEMAP=false

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
