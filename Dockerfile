ARG NODE_IMAGE=node:22.20.0-alpine
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

RUN mkdir -p /prod/router && pnpm deploy --prod --filter @genie-nexus/router /prod/router

FROM base

RUN apk add --no-cache tini curl

WORKDIR /app

RUN mkdir /gnxs-data && chown -R node: /gnxs-data
USER node

# router
COPY --from=build --chown=node:node /prod/router/ ./
RUN if [ -n "$VERSION" ]; then jq --arg version "$VERSION" '.version = $version' package.json > package.json.tmp && mv package.json.tmp package.json; fi

# frontend
RUN mkdir -p /app/.next && chown -R node: /app/.next
COPY --from=build --chown=node: /app/packages/management/.next/server ./.next/server
COPY --from=build --chown=node: /app/packages/management/.next/static ./.next/static
COPY --from=build --chown=node: /app/packages/management/.next/BUILD_ID ./.next/BUILD_ID
COPY --from=build --chown=node: /app/packages/management/.next/*.json ./.next

COPY --chown=node: --from=build /app/packages/management/public ./public

EXPOSE 3000

ENV NODE_ENV=production
ENV GNXS_RUNTIME_ENVIRONMENT=docker
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/_health || curl -f http://localhost:${PORT}/health-fe || exit 1


ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "--enable-source-maps", "dist/server.js"]