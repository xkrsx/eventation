import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogoutButton from '../(auth)/logout/LogoutButton';
import { getValidSession } from '../../database/sessions';
import { getUser } from '../../database/users';
import ProfileImage from '../common/Images/ProfileImage/ProfileImage';
import ProfileNotLogged from './notLogged';

type Props = { searchParams: { returnTo?: string | string[] } };

// when logged out: login/registration forms
// when logged in: view with settings, links to event manager etc
export default async function UserProfile(props: Props) {
  // authentication
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // 3. Redirect to login if sessionToken cookie is invalid
  if (!session) {
    return <ProfileNotLogged returnTo={props.searchParams.returnTo} />;
  }

  // 4. if the sessionToken cookie is valid, allow access to profile page

  const profile = await getUser(session.token);

  if (!profile) {
    return redirect('/');
  }

  return (
    <div className="wrapper">
      <div className="profile">
        <h1>Welcome, {profile.username}</h1>
        <h2>{profile.fullName}</h2>
        {/* TODO change to CldOgImage */}
        <ProfileImage profile={profile} />
        <ul>
          <li>
            <Link href={`/profile/${profile.username}`}>
              See your public profile
            </Link>
          </li>
          <li>
            <Link href="/profile/edit">Edit your profile</Link>
          </li>
          <li>
            <Link href="/profile/settings">Settings</Link>
          </li>
          <li>
            <Link href="/profile/events">My Events</Link>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>
      </div>
    </div>
  );
}
