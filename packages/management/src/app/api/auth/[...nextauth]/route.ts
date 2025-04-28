import { getNextAuth } from '@lib/auth/next-auth';
import { environment } from '@lib/environment';
import { type NextRequest, NextResponse } from 'next/server';

const dummyHandler = () => {
  return new NextResponse('Authentication method not available', {
    status: 500,
  });
};

export async function GET(request: NextRequest) {
  if (environment.AUTH_METHOD === 'none') {
    return dummyHandler();
  }

  const { handlers } = await getNextAuth();
  console.log('GET', handlers.GET);
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  if (environment.AUTH_METHOD === 'none') {
    return dummyHandler();
  }

  const { handlers } = await getNextAuth();
  return handlers.POST(request);
}
