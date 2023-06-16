FROM --platform=linux/amd64 node:16-alpine as build

# Run out of the /app folder
WORKDIR /app

# Copy in just the package.json and install deps
# We do this first separately to build a cached layer
COPY ./package.json ./
RUN npm install

# Copy in the source code and build the app
COPY ./ .
RUN npm run build
RUN npx prisma generate

# Copy build artifacts into a clean image
FROM --platform=linux/amd64 node:16-alpine as deploy

ENV NODE_ENV production

WORKDIR /app
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/package-lock.json /app/package-lock.json
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public

CMD ["npm", "run", "start"]