# Use an official Node.js image as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from the build context (./src/backend)
COPY ./package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose the application port
EXPOSE 8080

# Start the application
CMD [ "npm", "start" ]
