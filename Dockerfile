# Use a recent Node.js LTS version
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Use a minimal Nginx image to serve the built app
FROM nginx:alpine

# Optional: custom nginx.conf for client-side routing
# COPY nginx.conf /etc/nginx/nginx.conf

# Use Vite's default output directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
