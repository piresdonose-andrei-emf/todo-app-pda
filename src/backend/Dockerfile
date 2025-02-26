# Use an official Node.js image as a base
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json from src/backend
COPY src/backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files from src/backend
COPY src/backend/ ./

# Expose the port the app will run on
EXPOSE 8080

# Start the application
CMD [ "npm", "start" ]
