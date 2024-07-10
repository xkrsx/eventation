import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getValidSession } from '../../../database/sessions';
import { getUser, getUserPublicInsecure } from '../../../database/users';

type Props = {
  params: {
    username: string;
  };
};
// when logged out or it's not user account: public profile
// when logged in and it's user's account: public profile with edit button
export default async function UserProfile(props: Props) {
  // authentication
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // 3. Preview public profile if sessionToken cookie is invalid
  // If username does not exists, redirect to main page
  if (!session) {
    const profile = await getUserPublicInsecure(props.params.username);
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

  // TODO authenticate if it's user's profile to have 'edit' button
  // if it's someone else's profile, no 'edit' button
  // 4. if the sessionToken cookie is valid, allow access to profile page

  const profile = await getUser(session.token);

  if (!profile) {
    redirect('/');
  }

  return (
    <div className="wrapper">
      <div className="profile">
        <h1>User: {profile.username}</h1>
        <h2>Location: {profile.location}</h2>
        <h3>Account since: {String(profile.createdAt)}</h3>

        <Link href="/profile/edit">Edit your profile</Link>
      </div>
    </div>
  );
}
