FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-fund --no-audit
COPY . .
ENV NG_CLI_ANALYTICS=false
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY package*.json ./
RUN npm ci --omit=dev --no-fund --no-audit
COPY --from=build /app/dist ./dist
COPY server ./server
COPY database ./database
USER node
EXPOSE 3000
CMD ["node", "server/start.mjs"]
