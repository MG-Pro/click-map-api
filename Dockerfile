FROM node
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /home/admin/nodeApps/todo-dev-api
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
