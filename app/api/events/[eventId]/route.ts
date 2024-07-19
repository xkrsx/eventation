import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  deleteUsersEventOrganising,
  Event,
  UpdatedEvent,
  updateEvent,
} from '../../../../database/events';
import { eventSchema } from '../../../../migrations/00002-createTableEvents';

type EventParams = {
  params: {
    eventId: string;
  };
};

type EventResponseBodyPut =
  | {
      event: UpdatedEvent;
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
      id: Number(params.eventId),
      userId: result.data.userId,
      name: result.data.name,
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
