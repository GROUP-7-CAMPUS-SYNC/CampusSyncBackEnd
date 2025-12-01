# 1. Use an official Node.js runtime as a parent image
# 'alpine' is a lightweight version of Linux, good for production
FROM node:22-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json first
# We do this separately to leverage Docker's cache layer (faster builds)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your application code
COPY . .

# 6. Expose the port your app runs on
EXPOSE 3000

# 7. Define the command to run your app
CMD ["npm", "start"]