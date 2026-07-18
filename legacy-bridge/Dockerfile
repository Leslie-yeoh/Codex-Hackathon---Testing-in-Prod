FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_LEGACY_BRIDGE_API_BASE_URL=http://localhost:8000
ARG NEXT_PUBLIC_MOCK_DISPLAY_ACTIONS=false
ENV NEXT_PUBLIC_LEGACY_BRIDGE_API_BASE_URL=$NEXT_PUBLIC_LEGACY_BRIDGE_API_BASE_URL
ENV NEXT_PUBLIC_MOCK_DISPLAY_ACTIONS=$NEXT_PUBLIC_MOCK_DISPLAY_ACTIONS
RUN npm run build

FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.mjs ./next.config.mjs
CMD ["npm", "run", "start"]