FROM node
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /home/mg/www/cm-api.chinamakes.ru
COPY . .
RUN pnpm install
EXPOSE 3000
CMD ["pnpm", "start"]
