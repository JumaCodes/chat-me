FROM node:20

WORKDIR /app

# Copy root package.json + lockfile
COPY package.json yarn.lock ./

# Copy project manifests
COPY frontend/package.json frontend/
COPY backend/package.json backend/

# Install deps
RUN yarn --cwd frontend install && yarn --cwd backend install

# Copy rest of code
COPY . .

# Build frontend + backend
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
