# ------------------------
# Stage 1: Build
# ------------------------
FROM node:20 AS builder
WORKDIR /app

# Copy root manifest
COPY package.json yarn.lock ./

# Copy frontend + backend manifests
COPY frontend/package.json frontend/
COPY backend/package.json backend/

# Install with devDependencies (vite is here)
RUN yarn --cwd frontend install --frozen-lockfile --production=false \
    && yarn --cwd backend install --frozen-lockfile --production=false

# Copy the rest of the code
COPY . .

# Build frontend and backend
RUN yarn build


# ------------------------
# Stage 2: Production
# ------------------------
FROM node:20
WORKDIR /app

# Copy only production manifests
COPY package.json yarn.lock ./
COPY backend/package.json backend/

# Install only production deps
RUN yarn --cwd backend install --frozen-lockfile --production=true

# Copy backend + built frontend from builder
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend ./frontend

EXPOSE 3000

# Start the backend (frontend build is served by backend or static host)
CMD ["yarn", "start"]
