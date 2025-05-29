# 001 Weave Execution

This is a PRD for the weave execution feature. We are going to implement
a feature that allows users to execute a weave on a given input.

This feature will start with the following events and actions:

## Events

1. Incoming request
2. HTTP request completed

## Actions

1. Add, remove, set request headers
2. Add, remove, set response headers
3. Update response body
4. Update response status code

## Context

Each request has a context which is built at the beginning, which contains
the parameters of the request. The context will contain:

1. Request path
2. Request method
3. Request headers
4. Request body
5. Response headers
6. Response body
7. Response status code

Each action is combined with an optional condition, conditions we start
with are:

1. Equals
2. Not equals
3. Contains
4. Does not contain
5. Is empty
6. Is not empty

## Implementation

This feature is broken down into the following tasks:

### Tasks

#### Router

[x] Create the required types and the flow entity for supersave. This is in the types and database packages. The flow entity has a deploymentId that refers to the deployment it is the configuration for. - Created Zod schemas in packages/types/src/schemas/flow.ts - Created inferred types in packages/types/src/types/flow.ts - Added Flow entity to packages/database/src/entities.ts - Note: All types are inferred from Zod schemas for runtime validation

[x] In the execute.ts file, create a function that will execute the flow. This function will take a flow and a request and return a response. - Created RequestContext type to hold request/response state - Implemented executeFlow function that processes each step in sequence - Added condition evaluation with support for all condition types - Implemented action execution for all action types - Added proper type safety using discriminated unions - Added logging for debugging - Note: Flow execution is integrated with executeForHttp to transform requests before proxying - Note: Flow repository is exported from @genie-nexus/database instead of being redefined - Note: Flow query uses createQuery().eq() pattern for better type safety and query building - Note: Request context is created from express request and passed through the flow execution pipeline

#### UI

In the management package we need to create the UI when managing a Weave deployment.
This is in the packages/management/src/app/app/deployments/[id]/\_page-weave.tsx file.
The components for the editor should be in the lib/components/deployment-editor folder.

[ ] Create the raw layout for the weave editor. Only the container components, the contents will be added later.
[ ] Ask for the image of design of the weave editor and implement it with Mantine components.

#### Follow up tasks

- [ ] Update the actions and conditions to support expressions from the @supersave/expression package. A condition can have a value or an expression. If expression is filled in, it needs to be evaluated and then used as the value.
  - [ ] Update the types to support expressions.
  - [ ] Update the UI management to allow the user to fill in expressions. The update logic must be updated to handle expressions.
