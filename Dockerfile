# ---------- Stage 1: Build ----------
FROM node:20.19-bullseye AS builder
WORKDIR /app

# Copy only manifests (no node_modules)
COPY package.json yarn.lock ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build


# ---------- Stage 2: Production ----------
FROM node:20.19-bullseye
WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./
COPY backend/package.json backend/
RUN yarn --cwd backend install --frozen-lockfile --production

COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend ./frontend

EXPOSE 3000
CMD ["yarn", "start"]
