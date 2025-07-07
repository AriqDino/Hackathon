FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install 
RUN npm run build
EXPOSE 5000
ENV NODE_ENV=production
CMD ["npm","start"]
