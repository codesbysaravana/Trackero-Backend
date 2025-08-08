```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build || true # Replace with your actual build command if needed

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

ENV NODE_ENV production

EXPOSE 3000

CMD ["node", "app.js"]
```

# AutoDock timestamp: 2025-08-08T15:42:02.608185Z