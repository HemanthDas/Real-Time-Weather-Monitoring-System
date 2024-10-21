# Step 1: Build the React app using Node.js
FROM node:22-alpine AS build

WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .
# Build the application for production
RUN npm run build

# Step 2: Serve the static files using Nginx
FROM nginx:alpine

# Copy the built files from the 'build' stage to the Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config if exists
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]