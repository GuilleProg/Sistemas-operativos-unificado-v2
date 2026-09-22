# Imagen base de Node.js
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm ci

# Copiamos el código del proyecto
COPY . .

# Compilamos NestJS
RUN npm run build

# Puerto que utiliza NestJS
EXPOSE 3000

# Arrancamos la aplicación
CMD ["npm", "run", "start:prod"]