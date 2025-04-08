FROM node:20-alpine

WORKDIR /app

COPY src/app/package*.json ./

RUN npm install

COPY src/app/ ./

# Для продакшн сборки
# RUN npm run build

# Для разработки
EXPOSE 3000
CMD ["npm", "start"] 