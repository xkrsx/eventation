import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createEvent, Event } from '../../../database/events';
import { addStatus } from '../../../database/usersEventsStatus';
import { eventSchema } from '../../../migrations/00002-createTableEvents';

export type EventResponseBodyPost =
  | {
      event: Event[];
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
): Promise<NextResponse<EventResponseBodyPost>> {
  const requestBody = await request.json();

  // Validation schema for request body
  const result = eventSchema.safeParse(requestBody);

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

  const newEvent =
    sessionCookie &&
    (await createEvent(sessionCookie.value, {
      name: result.data.name,
      userId: result.data.userId,
      timeStart: new Date(result.data.timeStart),
      timeEnd: new Date(result.data.timeEnd),
      category: result.data.category,
      location: String(result.data.location),
      latitude: String(result.data.latitude),
      longitude: String(result.data.longitude),
      price: Number(result.data.price),
      description: String(result.data.description),
      links: String(result.data.links),
      images: String(result.data.images),
    }));

  console.log('newEvent: ', newEvent);

  if (newEvent) {
    await addStatus(
      sessionCookie.value,
      result.data.userId,
      newEvent.id,
      true,
      'yes',
    );
  } else {
    return NextResponse.json(
      {
        error: 'Event not created or access denied creating it.',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ event: newEvent });
}
