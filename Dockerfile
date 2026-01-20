ARG NODE_IMAGE=node:22.16.0-alpine
ARG VERSION

FROM ${NODE_IMAGE} AS base

RUN mkdir -p /app && chown -R node: /app
WORKDIR /app

RUN npm i -g pnpm@10.10.0 && apk add --no-cache jq

FROM base AS build

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./ 
COPY ./packages ./packages

RUN pnpm i --frozen-lockfile
RUN pnpm build

FROM base

RUN apk add --no-cache tini curl

WORKDIR /app

RUN mkdir /gnxs-data && chown -R node: /gnxs-data
USER node

COPY --from=build --chown=node:node /app/packages/management/.next/standalone ./
COPY --from=build --chown=node:node /app/packages/management/.next/static ./.next/static
COPY --from=build --chown=node:node /app/packages/management/public ./public

RUN if [ -n "$VERSION" ]; then jq --arg version "$VERSION" '.version = $version' package.json > package.json.tmp && mv package.json.tmp package.json; fi

EXPOSE 3000

ENV NODE_ENV=production
ENV GNXS_RUNTIME_ENVIRONMENT=docker
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health


ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
