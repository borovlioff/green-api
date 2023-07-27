# Используем образ Node.js
FROM node:14


# Установка рабочей директории внутри контейнера
WORKDIR /user/src/app

# Установка wait-for-it.sh с помощью curl
RUN curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x wait-for-it.sh
    
# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода
COPY . .

# Компиляция TypeScript в JavaScript
RUN npm run build

# Открытие порта, на котором будет работать приложение
EXPOSE 3000

# Ожидаем доступности RabbitMQ на порту 5672
CMD ["./wait-for-it.sh", "rabbitmq:5672", "--", "node", "build/index.js"]
