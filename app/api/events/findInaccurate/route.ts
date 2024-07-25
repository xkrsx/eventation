import { NextRequest, NextResponse } from 'next/server';
import { ZodIssue } from 'zod';
import {
  Event,
  findEventsInaccurateInsecure,
} from '../../../../database/events';
import { getUserByUsernameInsecure } from '../../../../database/users';
import { inaccurateSearchedEventSchema } from '../../../../migrations/00002-createTableEvents';

export type EventResponseBodyPost =
  | {
      events: (Event | undefined)[];
    }
  | { message: string | ZodIssue[] };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<EventResponseBodyPost>> {
  // 1. Get the event data from the request
  const body: {
    event: {
      name: string;
      username: string;
      category: string;
      location: string;
    };
  } = await request.json();

  const userId =
    body.event.username !== '' &&
    (await getUserByUsernameInsecure(body.event.username));

  // 2. Validate the user data with zod
  const event = {
    name: body.event.name,
    userId: userId,
    category: body.event.category,
    location: body.event.location,
  };

  const result = inaccurateSearchedEventSchema.safeParse(event);

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
      { message: 'Username or password invalid.' },
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
