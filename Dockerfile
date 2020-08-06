FROM node:alpine

ARG NODE_ENV=production
ARG DB_HOST
ARG DB_USER
ARG DB_NAME
ARG DB_PASS

ENV NODE_ENV=$NODE_ENV
ENV DB_HOST=$DB_HOST
ENV DB_USER=$DB_USER
ENV DB_NAME=$DB_NAME
ENV DB_PASS=$DB_PASS

WORKDIR /usr/src/app

COPY . .
RUN node -v
RUN npm install -g pnpm
RUN pnpm install
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s \
    CMD node healthcheck.js

CMD ["pnpm", "start"]
