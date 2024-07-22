import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export type ReactionsResponseBodyPost =
  | {
      reaction: { emoji: string };
    }
  | {
      error: string;
    };

interface RequestBody {
  messageId: string;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ReactionsResponseBodyPost>> {
  // Task: Create a new reaction for the message

  // Get the reaction data from the request
  const body: RequestBody = await request.json();

  // Validate reactions data with zod
  const result = reactionSchema.safeParse(body);

  // If client sends request body with incorrect data, return a response with a 400 status code to the client
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Request does not contain reaction object',
      },
      { status: 400 },
    );
  }

  // Checking if the sessionToken cookie exists or get the token from the cookie
  const sessionTokenCookie = cookies().get('sessionToken');

  // Create a reaction
  const newReaction =
    sessionTokenCookie &&
    (await createReaction(
      sessionTokenCookie.value,
      Number(body.messageId),
      result.data.emoji,
    ));

  // If the reaction creation fails, return an error
  if (!newReaction) {
    return NextResponse.json(
      {
        error: 'Reaction not created or access denied creating reactions',
      },
      { status: 400 },
    );
  }

  // notify all users about the new reaction
  await pusherServer.trigger(
    toPusherKey(`message:${Number(body.messageId)}`),
    'incoming-reaction',
    {
      id: newReaction.id,
      userId: newReaction.userId,
      messageId: newReaction.messageId,
      emoji: newReaction.emoji,
    },
  );

  // Return the text content of the message
  return NextResponse.json({
    reaction: {
      id: newReaction.id,
      userId: newReaction.userId,
      messageId: newReaction.messageId,
      emoji: newReaction.emoji,
    },
  });
}

export type ReactionsResponseBodyGet =
  | {
      reactions: Reaction[];
    }
  | {
      error: string;
    };

export type Props = {
  params: { messageId: string };
};

export async function GET(
  request: NextRequest,
  { params }: Props,
): Promise<NextResponse<ReactionsResponseBodyGet>> {
  // Task: Get reactions to display it on the gameId page

  const sessionCookie = request.cookies.get('sessionToken');
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const reactions = await getReactionsInsecure(Number(params.messageId));

  return NextResponse.json({ reactions });
}
