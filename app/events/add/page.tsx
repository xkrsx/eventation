import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSession } from '../../../database/sessions';
import { getUser } from '../../../database/users';
import AddEventForm from './AddEventForm';

export default async function AddEvent() {
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // 3. Redirect to login if sessionToken cookie is invalid
  if (!session) {
    return redirect('/profile?returnTo=/events/add');
  }

  // 4. if the sessionToken cookie is valid, allow access to add event page
  const profile = await getUser(session.token);

  if (!profile) {
    redirect('/');
  }

  return <AddEventForm userId={profile.id} />;
}
