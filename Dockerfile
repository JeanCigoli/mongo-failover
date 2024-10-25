FROM node:22.10-slim

WORKDIR /usr/app

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]