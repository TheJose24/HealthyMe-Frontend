FROM node:22-alpine AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración y dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm ci --production=false

# Copia el resto del código de la aplicación
COPY . .

# Compila la aplicación Angular
RUN npm run build -- --configuration production

# Usa una imagen Nginx para servir la aplicación Angular
FROM nginx:1.27.5-alpine-slim

# Copia la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia el build de Angular al directorio de Nginx
COPY --from=build /app/dist/healthy-me-frontend/browser /usr/share/nginx/html

# Copia los archivos robots.txt y sitemap.xml al directorio raíz de NGINX
COPY robots.txt /usr/share/nginx/html/robots.txt
COPY sitemap.xml /usr/share/nginx/html/sitemap.xml

# Configurar permisos y directorios necesarios
RUN apk add --no-cache brotli nginx-mod-http-brotli \
    && mkdir -p /var/cache/nginx/{client_temp,proxy_temp,fastcgi_temp,uwsgi_temp,scgi_temp} \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /etc/nginx/conf.d \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid \
    && chmod -R 755 /var/cache/nginx \
    && chmod -R 755 /var/log/nginx \
    && chmod -R 755 /etc/nginx/conf.d

# Establece el usuario de Nginx
USER nginx

# Exposición del puerto 80
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]