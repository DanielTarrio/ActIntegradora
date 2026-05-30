# Imagen base oficial de Node.js versión 24
FROM node:24 AS base

# Cambia al usuario root (0) temporalmente para tener permisos 
# de instalación, clonación y cambio de propietarios
USER 0

# Directorio de trabajo dentro del contenedor
WORKDIR /app


# Copiar todo el código de la aplicación al contenedor desde el disco local
COPY . .

# Instalar dependencias del proyecto
RUN npm install

# Cambia el propietario del directorio actual y sus subdirectorios al usuario 1001 y grupo root (0).
# Esto prepara los archivos para que el usuario sin privilegios pueda leerlos/ejecutarlos.
RUN chown -R 1001:0 .

# Cambia del usuario root a un usuario sin privilegios (1001) por motivos de seguridad.
USER 1001

#LABEL [define:Etiquetas]
LABEL \
  author="Daniel Tarrio" \
  email="daniel..tarrio@gmail.com" \
  description="Actividad integradora Curso Docker y Kubernetes UTN BA."

# Valor por defecto, si no se pasa ninguno
ARG TZ=America/Argentina/Buenos_Aires

#ENV [define:envs]
ENV TZ=${TZ}


# Exponer el puerto 8888 (puerto de desarrollo configurado)
EXPOSE 8888

# Inicia una nueva etapa basada en la anterior. Esto permite 
# separar la lógica de construcción de la imagen final si fuera necesario.
FROM base

# Comando para ejecutar la aplicación de React + Vite en modo desarrollo con acceso externo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8888"]
