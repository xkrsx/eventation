import { NextRequest, NextResponse } from 'next/server';
import {
  Event,
  findEventsInaccurateInsecure,
} from '../../../../database/events';
import { searchedEventSchema } from '../../../../migrations/00002-createTableEvents';

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
    event: { name: string; userId: number; category: string; location: string };
  } = await request.json();

  // 2. Validate the user data with zod
  const result = searchedEventSchema.safeParse(body.event);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.issues },
      {
        status: 400,
      },
    );
  }

  const foundEvents = await findEventsInaccurateInsecure(result.data);

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
