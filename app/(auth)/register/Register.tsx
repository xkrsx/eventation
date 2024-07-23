import './page.scss';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSession } from '../../../database/sessions';
import RegisterForm from './RegisterForm';

export default async function RegisterPage() {
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // 3. Redirect home if sessionToken cookie is valid
  if (session) {
    redirect('/');
  }
  // 4. Redirect to reg/login page if sessionToken cookie is invalid or doesn't exist
  return <RegisterForm />;
}