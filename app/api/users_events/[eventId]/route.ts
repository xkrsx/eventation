import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  deleteUsersEventOrganising,
  Event,
  updateEvent,
} from '../../../../database/events';
import { eventSchema } from '../../../../migrations/00002-createTableEvents';

type EventResponseBodyPut =
  | {
      event: Event;
    }
  | {
      error: string;
    };

export async function PUT(
  request: Request,
  { params }: EventParams,
): Promise<NextResponse<EventResponseBodyPut>> {
  const requestBody = await request.json();

  // If client sends request body with incorrect data,
  // return a response with a 400 status code to the client
  const result = eventSchema.safeParse(requestBody);

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

  const updatedEvent =
    sessionCookie &&
    (await updateEvent(sessionCookie.value, {
      eventId: Number(params.eventId),
      userId: result.data.userId,
      name: result.data.name,
      timeStart: result.data.timeStart,
      timeEnd: result.data.timeEnd,
      category: result.data.category,
      location: result.data.location,
      latitude: result.data.latitude,
      longitude: result.data.longitude,
      price: Number(result.data.price),
      description: result.data.description,
      links: result.data.links,
      images: result.data.images,
      public: result.data.public,
      cancelled: result.data.cancelled,
    }));

  if (!updatedEvent) {
    return NextResponse.json(
      {
        error: 'Event not created or access denied creating events',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ event: updatedEvent });
}

type EventResponseBodyDelete =
  | {
      event: Event;
    }
  | {
      error: string;
    };

type EventParams = {
  params: {
    eventId: string;
  };
};

export async function DELETE(
  request: Request,
  { params }: EventParams,
): Promise<NextResponse<EventResponseBodyDelete>> {
  // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');
  const event =
    sessionCookie &&
    (await deleteUsersEventOrganising(
      sessionCookie.value,
      Number(params.eventId),
    ));

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  return NextResponse.json({ event: event });
}
