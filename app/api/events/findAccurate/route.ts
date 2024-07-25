import { NextRequest, NextResponse } from 'next/server';
import {
  Event,
  findSingleEventAccurateInsecure,
} from '../../../../database/events';
import {
  eventSchema,
  safeEventQuerySchema,
} from '../../../../migrations/00002-createTableEvents';

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

  // TODO change function arguments
  const singleEvent = await findSingleEventAccurateInsecure(result.data.);

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
