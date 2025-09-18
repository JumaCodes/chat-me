FROM node:20

WORKDIR /app

# Copy root package.json + lockfile
COPY package.json yarn.lock ./

# Copy project manifests (cache layer for faster builds)
COPY frontend/package.json frontend/
COPY backend/package.json backend/

# Install deps (include devDeps so vite is available for build step)
RUN yarn --cwd frontend install --frozen-lockfile --production=false \
    && yarn --cwd backend install --frozen-lockfile --production=false

# Copy full source
COPY . .

# Build frontend + backend (uses your root package.json "build" script)
RUN yarn build

EXPOSE 3000

# Start backend (uses your root "start" script)
CMD ["yarn", "start"]
