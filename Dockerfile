FROM node:20-slim

# Install Chromium (needed by Marp CLI for PPTX/PDF export)
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build TypeScript
COPY . .
RUN pnpm run build

# Output directory for generated decks (mount a volume here in compose)
RUN mkdir -p /decks

EXPOSE 3100

CMD ["node", "build/index.js", "--port", "3100"]
