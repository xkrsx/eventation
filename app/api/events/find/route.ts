import { NextRequest, NextResponse } from 'next/server';
import { Event, findSingleEventInsecure } from '../../../../database/events';
import { eventSchema } from '../../../../migrations/00002-createTableEvents';

export type EventResponseBodyPost =
  | {
      event: Event;
    }
  | { errors: { message: string }[] };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<EventResponseBodyPost>> {
  // 1. Get the event data from the request
  const body: { event: Event } = await request.json();

  // 2. Validate the user data with zod
  const result = eventSchema.safeParse(body.event);

  const singleEvent = await findSingleEventInsecure();
  console.log(singleEvent);

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
