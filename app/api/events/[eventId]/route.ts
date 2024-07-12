import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { deleteUsersEventOrganising, Event } from '../../../../database/events';

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
