FROM node:16.9.0-alpine
WORKDIR /app
COPY package.json /app/
COPY src/ /app/src/
RUN npm install
CMD ["node", "src/index.js"]