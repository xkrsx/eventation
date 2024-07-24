// TODO all events for not logged in
// all + suggested events for logged in

import { cookies } from 'next/headers';
import { getValidSession } from '../../database/sessions';

export default async function Events() {
  // // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  // // 2. Check if the sessionToken cookie is still valid
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // // 4. If the sessionToken cookie is invalid or doesn't exist, show link to log in
  if (!session) {
    return;
  }
}
