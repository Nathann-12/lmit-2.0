FROM node:20-alpine AS build

WORKDIR /app

# Add ARG and ENV for the backend URL so it is available during the build step
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

COPY package.json ./

RUN npm install --legacy-peer-deps && npm install ajv@^8 --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
#end of frontend Dockerfile