import { getAuthMethod } from '@lib/auth/get-auth-method';
import { getNextAuth } from '@lib/auth/next-auth';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const dummyHandler = () => {
  return new NextResponse('Authentication method not available', {
    status: 500,
  });
};

export async function GET(request: NextRequest) {
  if ((await getAuthMethod()) === 'none') {
    return dummyHandler();
  }

  const { handlers } = await getNextAuth();
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  if ((await getAuthMethod()) === 'none') {
    return dummyHandler();
  }

  const { handlers } = await getNextAuth();
  return handlers.POST(request);
}
