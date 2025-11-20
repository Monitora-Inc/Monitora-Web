FROM node:20-alpine
WORKDIR /app
EXPOSE 3333
CMD ["node", "app.js"]