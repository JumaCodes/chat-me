# ---- Base image ----
FROM node:20

# Set working directory
WORKDIR /app

# Copy root package.json + yarn.lock
COPY package.json yarn.lock ./

# Copy sub-project manifests (so Docker can cache installs)
COPY frontend/package.json frontend/
COPY backend/package.json backend/

# Install dependencies for frontend & backend
RUN yarn --cwd frontend install && yarn --cwd backend install

# Copy the rest of the project files
COPY . .

# Build frontend + backend (calls root build script)
RUN yarn build

# Expose backend port
EXPOSE 3000

# Start backend (which also serves frontend in production)
CMD ["yarn", "start"]
