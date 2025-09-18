# ---------- Stage 1: Build ----------
FROM node:22.12 AS builder
WORKDIR /app

# Copy manifests
COPY package.json yarn.lock ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/

# Install all deps (root + workspaces)
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Build frontend & backend
RUN yarn build


# ---------- Stage 2: Production ----------
FROM node:22.12
WORKDIR /app

ENV NODE_ENV=production

# Copy only needed files
COPY package.json yarn.lock ./
COPY backend/package.json backend/

# Install only backend prod deps
RUN yarn --cwd backend install --frozen-lockfile --production

# Bring in compiled code
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend ./frontend

EXPOSE 3000

CMD ["yarn", "start"]

