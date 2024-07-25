import { NextRequest, NextResponse } from 'next/server';
import { ZodIssue } from 'zod';
import { Event, findEventsAccurateInsecure } from '../../../../database/events';
import { getUserByUsernameInsecure } from '../../../../database/users';
import { accurateSearchedFieldSchema } from '../../../../migrations/00002-createTableEvents';

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
    field: string;
    query: string;
  } = await request.json();

  // 2. Validate the user data with zod
  const result = accurateSearchedFieldSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: result.error.issues },
      {
        status: 400,
      },
    );
  }

  const userId =
    result.data.field === 'userId' &&
    (await getUserByUsernameInsecure(result.data.query));

  if (!userId) {
    return NextResponse.json(
      { message: 'No events found.' },
      {
        status: 500,
      },
    );
  }

  const foundEvents = await findEventsAccurateInsecure(
    result.data.field,
    result.data.field === 'userId' ? userId.id : result.data.query,
  );

  if (foundEvents.length === 0) {
    return NextResponse.json(
      { message: 'No events found.' },
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
