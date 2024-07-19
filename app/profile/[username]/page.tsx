import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getValidSession } from '../../../database/sessions';
import {
  getUserPublic,
  getUserPublicByUsernameInsecure,
} from '../../../database/users';

type Props = {
  params: {
    username: string;
  };
};
// 1. when logged out: public profile
// 2. when logged in and it's NOT user's account: 1 + e-mail
// 3. when logged in and it's user's account: 2 + edit button

export default async function UserProfile(props: Props) {
  // authentication
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // 3. Preview public profile if sessionToken cookie is invalid
  // If username does not exists, redirect to main page
  if (!session) {
    const profile = await getUserPublicByUsernameInsecure(
      props.params.username,
    );
    if (profile) {
      return (
        <div className="wrapper">
          <div className="profile">
            <h1>User: {profile.username}</h1>
            <h2>Location: {profile.location}</h2>
            <h3>Account since: {String(profile.createdAt)}</h3>
          </div>
        </div>
      );
    } else {
      redirect('/');
    }
  }

  // 4. if the sessionToken cookie is valid, allow access to profile page

  const profile = await getUserPublic(session.token, props.params.username);

  if (!profile) {
    redirect('/');
  }

  return (
    <div className="wrapper">
      <div className="profile">
        <h1>User: {profile.username}</h1>
        <h2>Location: {profile.location}</h2>
        <h3>Account since: {dayjs(profile.createdAt).format('MM/YYYY')}</h3>
        {session.userId === profile.id && (
          <Link href="/profile/edit">Edit your profile</Link>
        )}
      </div>
    </div>
  );
}
