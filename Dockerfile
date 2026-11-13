# Use Node 20 alpine for a lightweight image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy dependency definitions and install
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy the rest of the project files
COPY . .

# Expose the port your application runs on (default for 11ty is usually 8080)
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start"]
