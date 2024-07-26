import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { findSingleEventByCity } from '../../../../database/events';
import { findEventSchema } from '../../../../migrations/00002-createTableEvents';

export type FindEventByCityResponseBodyGet =
  | {
      location: string;
      // order: ['timeStart', 'price'];
    }
  | { errors: { message: string }[] };

export async function GET(
  request: NextRequest,
): Promise<NextResponse<FindEventByCityResponseBodyGet>> {
  // 1. Get the event data from the request
  const requestBody = await request.json();

  // 2. Validate the user data with zod
  const result = findEventSchema.safeParse(requestBody);

  // If client sends request body with incorrect data,
  // return a response with a 400 status code to the client
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Request does not contain event object.',
        errorIssues: result.error.issues,
      },
      { status: 400 },
    );
  }

  // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  const singleEvent =
    sessionCookie &&
    (await findSingleEventByCity(
      sessionCookie.value,
      result.data.location,
      result.data[0],
    ));

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.issues },
      {
        status: 400,
      },
    );
  }

  // 8. Return found event
  return NextResponse.json({
    event: body.event,
  });
}
