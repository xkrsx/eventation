import { NextRequest, NextResponse } from 'next/server';
import { getEvenLoungeAllMessages } from '../../../../database/chat/eventLounge';
import { EventLoungeMessage } from '../../../../migrations/00004-createTableEventLounge';

export type EventLoungeMessagesResponseBodyGet =
  | {
      messages: EventLoungeMessage[];
    }
  | {
      error: string;
    };

export type Props = {
  params: { eventId: string };
};

export async function GET(
  request: NextRequest,
  { params }: Props,
): Promise<NextResponse<EventLoungeMessagesResponseBodyGet>> {
  const sessionCookie = request.cookies.get('sessionToken');
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const messages = await getEvenLoungeAllMessages(
    sessionCookie.value,
    Number(params.eventId),
  );

  return NextResponse.json({ messages });
}
