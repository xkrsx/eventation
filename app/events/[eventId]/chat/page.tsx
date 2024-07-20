// TODO chat window of each event with tabs: open/orga

import { cookies } from 'next/headers';
import Link from 'next/link';
import { getValidSession } from '../../../../database/sessions';
import Chat from './Chat';

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
  return (
    <div>
      <h1>Event Chat</h1>
      <Chat />
    </div>
  );
}
