import { getAuth } from '@lib/auth/get-auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { environment } from '@lib/environment';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const dummyHandler = async () => {
  return Promise.resolve(
    new NextResponse('Authentication method not available', {
      status: 500,
    }),
  );
};

export let GET: (request: Request) => Promise<Response> = dummyHandler;
export let POST: (request: Request) => Promise<Response> = dummyHandler;

if (environment.AUTH_METHOD !== 'none') {
  const { GET: authGET, POST: authPOST } = toNextJsHandler(getAuth().handler);
  GET = authGET;
  POST = authPOST;
}
