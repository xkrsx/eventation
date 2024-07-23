import { NextRequest, NextResponse } from 'next/server';
import { getInfoStreamLastDayMessages } from '../../../../database/chat/infoStream';
import { InfoStreamMessage } from '../../../../migrations/00005-createTableInfoStream';

export type InfoStreamMessagesResponseBodyGet =
  | {
      messages: InfoStreamMessage[];
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
): Promise<NextResponse<InfoStreamMessagesResponseBodyGet>> {
  const sessionCookie = request.cookies.get('sessionToken');
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const messages = await getInfoStreamLastDayMessages(
    sessionCookie.value,
    Number(params.eventId),
  );

  return NextResponse.json({ messages });
}
