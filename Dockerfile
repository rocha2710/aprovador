# Estágio de Build
FROM node:lts-alpine as build-stage

WORKDIR /app

# Define que o Docker espera receber essas variáveis durante o build
ARG VITE_POCKETBASE_URL

# Torna as variáveis disponíveis para o processo do Node/Vite
ENV VITE_POCKETBASE_URL=$VITE_POCKETBASE_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Estágio de Produção
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]