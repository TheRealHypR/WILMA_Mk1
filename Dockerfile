# Use the Node.js 20 base image
FROM node:20

ENV VITE_FIREBASE_API_KEY AIzaSyAxQAUCBS1r2etrRSUw5ygz3PTK7QIpnZ0
ENV VITE_FIREBASE_AUTH_DOMAIN wilma-dev01.firebaseapp.com
ENV VITE_FIREBASE_PROJECT_ID wilma-dev01
ENV VITE_FIREBASE_STORAGE_BUCKET wilma-dev01.firebasestorage.app
ENV VITE_FIREBASE_MESSAGING_SENDER_ID 598054561771
ENV VITE_FIREBASE_APP_ID 1:598054561771:web:7577bec586bc6743c89bae

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
