FROM node
ARG NODE_ENV=development
ARG DB_CONFIG={}
ENV NODE_ENV=${NODE_ENV}
ENV DB_SETTINGS=$DB_CONFIG
RUN "echo $DB_CONFIG"
WORKDIR /home/mg/www/cm-api.chinamakes.ru
COPY . .
RUN node -v
RUN npm install -g pnpm
RUN pnpm install
EXPOSE 3000
CMD ["pnpm", "start"]
