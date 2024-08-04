ARG ARCH=amd64
ARG NODE_VERSION=20
ARG OS=bullseye-slim

#### Stage BASE ########################################################################################################
FROM ${ARCH}/node:${NODE_VERSION}-${OS} AS base
# FROM node:16-slim

# Change the working directory on the Docker image to /app
WORKDIR /app

# Copy package.json and package-lock.json to the /app directory
COPY ["package.json", "package-lock.json", "./"]

# Install dependencies
RUN npm install express

# Copy the rest of project files into this image
COPY . .

# Expose application port
EXPOSE 3001 3443

# Start the application
#ENTRYPOINT ["node", "app.js"]
ENTRYPOINT [ "sh", "-c", "node app.js > ./log.txt 2>&1" ]