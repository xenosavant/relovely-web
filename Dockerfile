# base image
FROM node:12.4.0 as build

# set working directory (also creates two folders needed for cypress)
RUN mkdir /usr/src/app
RUN mkdir /usr/src/app/cypress
RUN mkdir /usr/src/app/cypress/plugins
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV PUPPETEER_SKIP_DOWNLOAD true

# install app and cache app dependencies
COPY . /usr/src/app

RUN npm i

RUN npm run build-prod

FROM nginx:1.16.0-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
