import { cookies } from 'next/headers';
import { getValidSession } from '../../database/sessions';
import EventsLogged from './EventsLogged';
import EventsNotLogged from './EventsNotLogged';

export default async function Events() {
  // // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  // // 2. Check if the sessionToken cookie is still valid
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // // 3. If the sessionToken cookie is invalid or doesn't exist, show all the events

  if (!session) {
    return <EventsNotLogged />;
  }

  // // 4. if the sessiontoken is valid, show events in the city

  return <EventsLogged session={session} />;
}
