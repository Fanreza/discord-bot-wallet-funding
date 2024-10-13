# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Install PM2 globally
RUN yarn global add pm2

# Copy the rest of the application files
COPY . .

# Build the TypeScript code
RUN yarn build

# Expose the desired port (replace with your port if different)
EXPOSE 3000

# Use PM2 to start the application
CMD ["pm2-runtime", "dist/index.cjs"]