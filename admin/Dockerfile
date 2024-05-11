FROM node:alpine AS build
WORKDIR /client
COPY package.json .
RUN npm i
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /client/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
