import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  createInfoStreamMessage,
  getInfoStreamLastHourMessages,
} from '../../../database/chat/infoStream';
import { eventLoungeMessageSchema } from '../../../migrations/00004-createTableEventLounge';
import { InfoStreamMessage } from '../../../migrations/00005-createTableInfoStream';
import { pusherServer, toPusherKey } from '../../../util/pusher';

export type InfoStreamMessagesResponseBodyPost =
  | {
      message: { content: string };
    }
  | {
      error: string;
    };

interface RequestBody {
  eventId: string;
  content: string;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<InfoStreamMessagesResponseBodyPost>> {
  const body: RequestBody = await request.json();

  const result = eventLoungeMessageSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Request does not contain message object',
      },
      { status: 400 },
    );
  }

  const sessionTokenCookie = cookies().get('sessionToken');

  // // new message to db
  const newMessage =
    sessionTokenCookie &&
    (await createInfoStreamMessage(
      sessionTokenCookie.value,
      Number(body.eventId),
      result.data.content,
    ));

  if (!newMessage) {
    return NextResponse.json(
      {
        error: 'Error while sending a message.',
      },
      { status: 400 },
    );
  }

  // // new message to pusher
  await pusherServer.trigger(
    toPusherKey(`infoStream:${Number(body.eventId)}`),
    'incoming-message',
    {
      id: newMessage.id,
      userId: newMessage.userId,
      eventId: newMessage.eventId,
      content: newMessage.content,
      timestamp: newMessage.timestamp,
    },
  );

  // // get new message as response
  return NextResponse.json({
    message: {
      id: newMessage.id,
      userId: newMessage.userId,
      eventId: newMessage.eventId,
      content: newMessage.content,
      timestamp: newMessage.timestamp,
    },
  });
}

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

  const messages = await getInfoStreamLastHourMessages(
    sessionCookie.value,
    Number(params.eventId),
  );

  return NextResponse.json({ messages });
}
