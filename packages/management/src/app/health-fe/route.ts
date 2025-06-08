import { NextResponse } from 'next/server';

// biome-ignore lint/suspicious/useAwait: <explanation>
export const GET = async function () {
  return NextResponse.json({ status: 'ok' });
};
