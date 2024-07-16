import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  deleteUsersEventOrganising,
  Event,
  updateEvent,
} from '../../../../database/events';
import { eventSchema } from '../../../../migrations/00002-createTableEvents';
import { usersEventsStatusSchema } from '../../../../migrations/00003-createTableUsersEvents';

type EventParams = {
  params: {
    eventId: string;
  };
};

export type UsersEventsStatusResponseBodyPost =
  | {
      event: Event;
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
): Promise<NextResponse<UsersEventsStatusResponseBodyPost>> {
  const requestBody = await request.json();

  // Validation schema for request body
  const result = usersEventsStatusSchema.safeParse(requestBody);

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

type UsersEventsStatusResponseBodyPut =
  | {
      event: Event;
    }
  | {
      error: string;
    };

export async function PUT(
  request: Request,
  { params }: EventParams,
): Promise<NextResponse<UsersEventsStatusResponseBodyPut>> {
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

type UsersEventsStatusResponseBodyDelete =
  | {
      event: Event;
    }
  | {
      error: string;
    };

export async function DELETE(
  request: Request,
  { params }: EventParams,
): Promise<NextResponse<UsersEventsStatusResponseBodyDelete>> {
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
