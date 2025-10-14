FROM node:20-alpine

WORKDIR /app

# Copy only package files first (for Docker caching)
COPY package.json ./

# Install dependencies (inside the container)
RUN npm install 

# Copy your source code
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
