# syntax=docker.io/docker/dockerfile:1

FROM node:22-bullseye

# Install libc6-compat (needed by some Node packages)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy only package.json and install dependencies
COPY package.json ./
RUN npm install --include=dev

# Copy rest of the project files
COPY . .

# Compile TypeScript files
RUN npm run compile

# Expose port
EXPOSE 5173
EXPOSE 9230
EXPOSE 24678

# Set environment variables
ENV HOSTNAME=0.0.0.0
# ENV PORT=3030

# Run in development mode
#CMD ["npm", "run", "dev"]
#CMD ["node", "--inspect=0.0.0.0:9229", "node_modules/next/dist/bin/next", "dev"]
# CMD ["node", "--inspect=0.0.0.0:9229", "dist/app.js"]
CMD ["node", "--inspect=0.0.0.0:9230", "./node_modules/vite/bin/vite.js", "dev", "--host", "0.0.0.0"]