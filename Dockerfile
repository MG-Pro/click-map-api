FROM node
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV DB_SETTINGS=DB_SETTINGS
RUN 'echo $DB_SETTINGS'
WORKDIR /home/mg/www/cm-api.chinamakes.ru
COPY . .
RUN node -v
RUN npm install -g pnpm
RUN pnpm install
EXPOSE 3000
CMD ["pnpm", "start"]
