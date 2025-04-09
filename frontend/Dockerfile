FROM node:20-alpine as build

WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY ./src/package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY ./src .

# Собираем проект
RUN npm run build

# Второй этап сборки - используем nginx для раздачи статических файлов
FROM nginx:latest

# Копируем собранное приложение в директорию nginx
COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
