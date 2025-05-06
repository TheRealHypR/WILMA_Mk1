# Use the Node.js 20 base image
FROM node:20

WORKDIR /app

# Copy the entire application code
COPY . .

# Build the application
RUN cd frontend && npm install
RUN cd functions && npm install --legacy-peer-deps

# Expose the port your app runs on
EXPOSE 5173

# Command to start the application
CMD ["cd", "frontend", "&&", "npm", "run", "dev"]
