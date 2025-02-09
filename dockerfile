FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --verbose --no-progress --only=prod
COPY ./ ./

EXPOSE 3000

CMD ["npm", "start"]