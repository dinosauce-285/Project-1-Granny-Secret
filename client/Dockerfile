# Build Stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Capture Render Environment Variables at Build Time
ARG REACT_APP_API_URL
ARG REACT_APP_SUPABASE_URL
ARG REACT_APP_SUPABASE_KEY
ARG REACT_APP_API_KEY

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_SUPABASE_URL=$REACT_APP_SUPABASE_URL
ENV REACT_APP_SUPABASE_KEY=$REACT_APP_SUPABASE_KEY
ENV REACT_APP_API_KEY=$REACT_APP_API_KEY

RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
