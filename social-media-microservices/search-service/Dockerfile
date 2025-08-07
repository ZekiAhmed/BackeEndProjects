# use the official node.js 18 image with Alpine Linux as the base image
FROM node:18-alpine

# set the working directory inside the container
WORKDIR /app

# copy package.json and package-lock.json to the working directory
COPY package*.json ./

# install the dependencies
RUN npm ci --only=production

# copy the rest of the application code to the working directory
COPY . .

# expose the port on which the application will run
EXPOSE 3004

# start the application
CMD ["node", "src/server.js"]