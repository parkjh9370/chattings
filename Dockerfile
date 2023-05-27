FROM node:16-alpine AS deps
WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
RUN ["yarn", "install"]

FROM node:16-alpine AS builder
WORKDIR /app
COPY ["tsconfig.build.json", "tsconfig.json", "./"]
COPY ["src/", "./src/"]
COPY [".env.production", "./"]
COPY --from=deps /app/node_modules ./node_modules
RUN ["npx", "nest", "build"]

FROM node:16-alpine AS runner
WORKDIR /app
COPY ["views/", "./views/"]
COPY ["public/", "./public/"]
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env.production ./
ENV NODE_ENV="production"
CMD ["node", "dist/main"]

EXPOSE 80

# docker build -t chattings -f Dockerfile .
# docker run -d -p 80:80 chattings