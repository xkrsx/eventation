import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSingleEventInsecure } from '../../../../database/events';
import { getOpenChatRecentMessages } from '../../../../database/openChats';
import { getValidSession } from '../../../../database/sessions';
import { getUserPublicById } from '../../../../database/users';
import ChatInput from './ChatInput';
import OpenChat from './OpenChat';

// COOL NAMES (hopefully)
// open: event lounge
// orga: info stream

type Props = {
  params: {
    eventId: string;
  };
};

export default async function EventChat(props: Props) {
  // // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  // // 2. Check if the sessionToken cookie is still valid
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  const event = await getSingleEventInsecure(Number(props.params.eventId));
  if (!event) {
    redirect('/events/find');
  }

  // TODO add authorization to chat only for users attending this event
  // // 3. If the sessionToken cookie is invalid or doesn't exist, show link to log in
  if (!session) {
    return (
      <div>
        <Link href={`/login?returnTo=/events/${props.params.eventId}/chat`}>
          Log in to chat with others.
        </Link>
      </div>
    );
  }
  // // 4. If the sessionToken cookie is valid, show chat
  const messages = await getOpenChatRecentMessages(
    session.token,
    Number(props.params.eventId),
  );

  return (
    <div>
      <h1>{event.name} Chat</h1>
      <OpenChat
        messages={messages}
        currentUserId={session.userId}
        eventId={Number(props.params.eventId)}
      />
      <ChatInput eventId={Number(props.params.eventId)} />
    </div>
  );
}
