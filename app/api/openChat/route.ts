import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { pusherServer, toPusherKey } from '../../../util/pusher';

export type OpenChatMessagesResponseBodyPost =
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
): Promise<NextResponse<OpenChatMessagesResponseBodyPost>> {
  // Task: Create a new message for the current logged in user

  // Get the message data from the request
  const body: RequestBody = await request.json();

  // Validate messages data with zod
  const result = openchatMessageSchema.safeParse(body);

  // If client sends request body with incorrect data, return a response with a 400 status code to the client
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Request does not contain message object',
      },
      { status: 400 },
    );
  }

  // Checking if the sessionToken cookie exists or get the token from the cookie
  const sessionTokenCookie = cookies().get('sessionToken');

  // Create a message
  const newMessage =
    sessionTokenCookie &&
    (await createOpenChatMessage(
      sessionTokenCookie.value,
      Number(body.eventId),
      result.data.content,
    ));

  // If the message creation fails, return an error
  if (!newMessage) {
    return NextResponse.json(
      {
        error: 'Error while sending a message.',
      },
      { status: 400 },
    );
  }

  // notify all connected chat room clients
  await pusherServer.trigger(
    toPusherKey(`event:${Number(body.eventId)}`),
    'incoming-message',
    {
      id: newMessage.id,
      userId: newMessage.userId,
      eventId: newMessage.eventId,
      content: newMessage.content,
      timestamp: newMessage.timestamp,
    },
  );

  // Return the text content of the message
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

export type OpenChatMessagesResponseBodyGet =
  | {
      messages: OpenChatMessage[];
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
): Promise<NextResponse<OpenChatMessagesResponseBodyGet>> {
  // Task: Get messages to display it on the eventId page

  const sessionCookie = request.cookies.get('sessionToken');
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const messages = await getOpenChatRecentMessages(
    sessionCookie.value,
    Number(params.eventId),
  );

  return NextResponse.json({ messages });
}
