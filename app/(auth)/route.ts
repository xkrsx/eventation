/* eslint-disable no-restricted-syntax */
import Ably from 'ably';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // get client id from query params
  const clientIdParam = process.env.ABLY_CLIENT_ID;

  const client = new Ably.Rest({
    key: process.env.ABLY_SECRET_KEY,
  });
  // create token request with the client id and chat capabilities
  const tokenRequestData = await client.auth.createTokenRequest({
    capability: {
      '[chat]*': ['*'],
      '*': ['*'],
    },
    clientId: clientIdParam!,
  });

  return NextResponse.json(tokenRequestData, {
    status: 200,
  });
}
