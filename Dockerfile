# Download node 14 image
FROM node:14
# Select root directory for work in container
WORKDIR /usr/workspace/clean-node-api
# Copy only package.json of my project to workdir of my container
COPY ./package.json .
# run command install of npm. --only=prod will download only prod dependencies
RUN npm install  --only=pro