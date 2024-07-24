// TODO edit profile, eg.: username, full name, location etc.
// show edit options only for each logged user

import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getValidSession } from '../../../database/sessions';
import { getUserPublicById } from '../../../database/users';
import EditProfilePreview from './EditProfilePreview';

export default async function EditProfile() {
  // // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  // // 2. Check if the sessionToken cookie is still valid
  const session = sessionCookie && (await getValidSession(sessionCookie.value));
  if (!session) {
    return (
      <strong>
        <Link href="/login?returnTo=/profile/edit">
          Log in to edit your profile.
        </Link>
      </strong>
    );
  }
  // // 3. If the sessionToken is valid, allow user to edit their profile

  const profile = await getUserPublicById(session.token, session.userId);

  if (!profile) {
    redirect('/');
  }

  return <EditProfilePreview profile={profile} />;
}
