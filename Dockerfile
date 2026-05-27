# Imagen base oficial de Node.js versión 24
FROM node:24 AS base

USER 0

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar todo el código de la aplicación al contenedor
COPY . .

RUN chown -R 1001:0 .



USER 1001


# Exponer el puerto 8888 (puerto de desarrollo configurado)
EXPOSE 8888

FROM base

# Comando para ejecutar la aplicación de React + Vite en modo desarrollo con acceso externo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8888"]
