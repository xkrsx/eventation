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
  | { errors: { message: string | ZodIssue[] } };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<EventResponseBodyPost>> {
  // 1. Get the event data from the request
  const body: {
    name: string;
    username: string;
    category: string;
    location: string;
  } = await request.json();

  // // 2. change username key to userId before finding user in DB
  const { username: userId, ...rest } = body;
  const updatedBody = { ...rest, userId };

  const foundUserId = await getUserByUsernameInsecure(updatedBody.userId);

  // 2. Validate the user data with zod
  const bodyWithUserId = {
    name: String(body.name ? body.name : ''),
    userId: String(foundUserId ? foundUserId.id : ''),
    category: String(body.category ? body.category : ''),
    location: String(body.location ? body.location : ''),
  };

  const result = inaccurateSearchedEventSchema.safeParse(bodyWithUserId);

  if (!result.success) {
    return NextResponse.json(
      { errors: { message: result.error.issues } },
      {
        status: 400,
      },
    );
  }

  const foundEvents = await findEventsInaccurateInsecure(result.data);

  if (foundEvents.length === 0) {
    return NextResponse.json(
      { errors: { message: 'No events found.' } },
      {
        status: 500,
      },
    );
  }

  // // 8. Return found event
  return NextResponse.json({
    events: foundEvents,
  });
}
