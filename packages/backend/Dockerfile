# Use an official Node.js runtime as a base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json yarn.lock ./

# Install app dependencies
RUN yarn --pure-lockfile

# Copy the application code into the container
COPY . .

# Expose the port your app runs on
EXPOSE 8888

# Define the command to run your application
CMD ["yarn", "start"]
