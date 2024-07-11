import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createEvent, Event } from '../../../database/events';
import { eventSchema } from '../../../migrations/00002-createTableEvents';

export type EventsResponseBodyGet =
  | {
      events: Event[];
    }
  | {
      error: string;
    };

export type EventsResponseBodyPost =
  | {
      event: Event;
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
): Promise<NextResponse<EventsResponseBodyPost>> {
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
      timeStart: result.data.timeStart,
      timeEnd: result.data.timeEnd,
      category: result.data.category,
      location: result.data.location,
      latitude: result.data.latitude,
      longitude: result.data.longitude,
      price: result.data.price,
      description: result.data.description,
      links: result.data.links,
      images: result.data.images,
    }));

  if (!newEvent) {
    return NextResponse.json(
      {
        error: 'Event not created or access denied creating animals',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ event: newEvent });
}
