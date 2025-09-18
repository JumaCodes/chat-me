FROM node:20

WORKDIR /app

# Copy root package.json + lockfile
COPY package.json yarn.lock ./

# Copy project manifests (so installs can be cached)
COPY frontend/package.json frontend/
COPY backend/package.json backend/

# Install dependencies for frontend + backend (include devDeps so vite is available)
RUN yarn --cwd frontend install --frozen-lockfile --production=false \
    && yarn --cwd backend install --frozen-lockfile --production=false

# Copy the rest of the source code
COPY . .

# Build frontend + backend (this calls your root "build" script)
RUN yarn build

EXPOSE 3000

# Start the backend (this calls your root "start" script)
CMD ["yarn", "start"]
