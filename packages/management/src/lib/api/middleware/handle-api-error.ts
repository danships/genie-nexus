import { NextResponse } from 'next/server';
import { ApplicationError } from './errors';

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApplicationError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}
