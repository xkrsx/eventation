import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSession } from '../../../database/sessions';
import { getSafeReturnToPath } from '../../../util/validation';
import LoginForm from './LoginForm';

type Props = { returnTo?: string | string[] };

export default async function Login(props: Props) {
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // 3. Redirect home if sessionToken cookie is valid
  if (session) {
    redirect(getSafeReturnToPath(props.returnTo) || `/profile`);
  }
  // 4. Redirect to login page if sessionToken cookie is invalid or doesn't exist
  return <LoginForm returnTo={props.returnTo} />;
}
