FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --no-audit
RUN npm install -g pm2
COPY . . 
EXPOSE 4000
CMD ["pm2-runtime", "ecosystem.config.cjs"]
