import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSession } from '../../../database/sessions';

type Props = {
  params: {
    username: string;
  };
};
// when logged out: login/registration forms
// when logged in: view with settings, links to event manager etc
export default async function UserProfile(props: Props) {
  // authentication
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // 3. Redirect to login if sessionToken cookie is valid
  if (!session) {
    redirect('/login?returnTo=/profile');
  }

  const profile = await getUser(session.token);

  // 4. if the sessionToken cookie is valid, allow access to profile page

  return (
    <div className="wrapper">
      <div className="profile">
        <h1>User: {props.params.username}</h1>
      </div>
    </div>
  );
}
