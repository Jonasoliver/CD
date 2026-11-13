# ---------- Etapa 1: build ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Etapa 2: imagem final (somente o necessário para rodar) ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./
USER node
EXPOSE 3000
CMD ["node", "server.js"]
