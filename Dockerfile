ARG NODE_IMAGE=node:22.16.0-alpine

FROM ${NODE_IMAGE} AS base

RUN mkdir -p /app && chown -R node: /app
WORKDIR /app

RUN npm i -g pnpm

FROM base AS build

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./ 
COPY ./packages ./packages

RUN pnpm i --frozen-lockfile
RUN pnpm build

RUN mkdir -p /prod/router && pnpm deploy --prod --filter @genie-nexus/router /prod/router

FROM base

RUN apk add --no-cache tini curl

WORKDIR /app
USER node

# router
COPY --from=build --chown=node:node /prod/router/ ./

# frontend
RUN mkdir -p /app/.next && chown -R node: /app/.next
COPY --from=build --chown=node: /app/packages/management/.next/server ./.next/server
COPY --from=build --chown=node: /app/packages/management/.next/static ./.next/static
COPY --from=build --chown=node: /app/packages/management/.next/BUILD_ID ./.next/BUILD_ID
COPY --from=build --chown=node: /app/packages/management/.next/*.json ./.next

COPY --chown=node: --from=build /app/packages/management/public ./public

EXPOSE 3000

ENV NODE_ENV=production
ENV RUNTIME_ENVIRONMENT=docker
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/_health || curl -f http://localhost:${PORT}/health-fe || exit 1


ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "--enable-source-maps", "dist/server.js"]