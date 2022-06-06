FROM node:14-alpine AS BUILD_IMAGE

RUN apk add --no-cache make gcc g++

WORKDIR /usr/src/ax-invest

COPY . .

RUN npm install
RUN npm run build
RUN npm prune --production

FROM node:14-alpine

WORKDIR /usr/src/ax-invest

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/ax-invest/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/ax-invest/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/ax-invest/scripts ./scripts
COPY --from=BUILD_IMAGE /usr/src/ax-invest/prisma ./prisma
COPY --from=BUILD_IMAGE /usr/src/ax-invest/package.json ./package.json

RUN apk add --no-cache tzdata
ENV TZ=America/Sao_Paulo

EXPOSE 3000
CMD [ "npm", "run", "prod:server" ]