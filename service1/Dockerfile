# Используем образ Node.js
FROM node:14

# Установка рабочей директории внутри контейнера
WORKDIR /user/src/app

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

# Запуск приложения
CMD ["node", "build/index.js"]
