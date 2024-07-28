import { cookies } from 'next/headers';
import { getValidSession } from '../../../database/sessions';
import FindEventForm from './FindEventForm';

export default async function FindEvent() {
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB
  const session = sessionCookie && (await getValidSession(sessionCookie.value));
  return (
    <div className="wrapper">
      <h1>Find events</h1>
      <FindEventForm session={session} />
    </div>
  );
}
