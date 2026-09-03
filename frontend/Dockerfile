# syntax=docker/dockerfile:1

# --- Build stage ----------------------------------------------------------
# The API URL is baked in at build time because Vite inlines import.meta.env
# into the static bundle — there is no server to read it at runtime. It is
# passed as a build arg so the same Dockerfile produces a bundle pointed at
# whatever origin the deployment actually serves from.
FROM node:20-slim AS build

ARG VITE_API_URL=/
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /app

# Copy the manifests first so `npm ci` is cached and only re-runs when the
# dependencies actually change, not on every source edit.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Serve stage ----------------------------------------------------------
# nginx serves the static build. It is a static-file server only; every API
# call is sent to a different origin (handled by the reverse proxy in front),
# so nothing dynamic runs here.
FROM nginx:1.27-alpine

# Drop the default site and install the SPA config, which falls back to
# index.html so client-side routes resolve on a hard refresh.
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/difaac.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
    CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
