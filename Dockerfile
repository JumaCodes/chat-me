# ---------- Stage 1: Build ----------
FROM node:20.18-bullseye AS builder
WORKDIR /app

# Let Yarn ignore engine mismatches
ENV YARN_IGNORE_ENGINES=true

# Copy only manifests (no node_modules)
COPY package.json yarn.lock ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/

# Install all deps
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build


# ---------- Stage 2: Production ----------
FROM node:20.18-bullseye
WORKDIR /app

ENV NODE_ENV=production
ENV YARN_IGNORE_ENGINES=true

COPY package.json yarn.lock ./
COPY backend/package.json backend/

# Install only backend production deps
RUN yarn --cwd backend install --frozen-lockfile --production

# Bring in compiled code
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend ./frontend

EXPOSE 3000
CMD ["yarn", "start"]
