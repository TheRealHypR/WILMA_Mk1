# Use the Node.js 20 base image
FROM node:20

WORKDIR /app

# Copy the entire application code
COPY . .

# Build the application
WORKDIR /app/frontend
RUN npm install

WORKDIR /app/functions
RUN npm install --legacy-peer-deps

# Expose the port your app runs on
EXPOSE 5173

# Command to start the application
WORKDIR /app/frontend
CMD ["npm", "run", "dev"]
