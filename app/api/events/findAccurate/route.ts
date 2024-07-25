import { NextRequest, NextResponse } from 'next/server';
import { Event, findEventsAccurateInsecure } from '../../../../database/events';
import { searchedFieldSchema } from '../../../../migrations/00002-createTableEvents';

export type EventResponseBodyPost =
  | {
      events: (Event | undefined)[];
    }
  | { errors: { message: string }[] };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<EventResponseBodyPost>> {
  // 1. Get the event data from the request
  const body: {
    field: string;
    query: string;
  } = await request.json();

  // 2. Validate the user data with zod
  const fieldResult = searchedFieldSchema.safeParse(body.field);
  // const eventResult = searchedAccurateEventSchema.safeParse(body.event);

  if (!fieldResult.success) {
    return NextResponse.json(
      { errors: fieldResult.error.issues },
      {
        status: 400,
      },
    );
  }

  const foundEvents = await findEventsAccurateInsecure(
    fieldResult.data.field,
    body.query,
  );

  if (!foundEvents) {
    return NextResponse.json(
      { errors: [{ message: 'Username or password invalid.' }] },
      {
        status: 500,
      },
    );
  }

  // 8. Return found event
  return NextResponse.json({
    events: foundEvents,
  });
}
