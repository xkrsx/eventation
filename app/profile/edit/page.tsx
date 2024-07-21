// TODO edit profile, eg.: username, full name, location etc.
// show edit options only for each logged user

import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getValidSession } from '../../../database/sessions';
import { deleteUser, getUserPublicById } from '../../../database/users';

type Props = {
  params: {
    userId: string;
  };
};

export default async function EditProfile(props: Props) {
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

  const profile = await getUserPublicById(
    session.token,
    Number(props.params.userId),
  );

  if (!profile) {
    redirect('/');
  }

  return (
    <div className="wrapper">
      <h1>Edit profile</h1>
      <div className="profile">
        <h1>User: {profile.username}</h1>
        <h2>Location: {profile.location}</h2>
        <h3>Account since: {dayjs(profile.createdAt).format('MM/YYYY')}</h3>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await deleteUser(session.token, Number(props.params.userId));
          }}
        >
          <button>Delete my profile</button>
        </form>
      </div>
    </div>
  );
}
