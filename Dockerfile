FROM node:20-alpine

WORKDIR /app

ARG MONGODB
# Copy only package files first (for Docker caching)
COPY package.json ./

# Install dependencies (inside the container)
RUN npm install 

# Copy your source code
COPY . .
ENV MONGODB=${MONGODB}

EXPOSE 3000

CMD ["npm", "start"]
