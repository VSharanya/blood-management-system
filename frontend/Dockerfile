# Build stage
FROM node:20 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# ✅ Fix OpenSSL issue
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm run build

# Serve stage
FROM nginx:alpine

# ✅ Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ✅ Copy built files
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
