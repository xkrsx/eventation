import './page.scss';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSession } from '../../database/sessions';
import { getUser } from '../../database/users';
import ProfileLogged from './Logged';
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

  return <ProfileLogged profile={profile} />;
}
