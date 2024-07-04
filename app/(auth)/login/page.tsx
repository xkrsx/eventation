import './page.scss';
import { cookies } from 'next/headers';
import LoginForm from './LoginForm';

type Props = { searchParams: { returnTo?: string | string[] } };

export default function LoginPage(props: Props) {
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB


  return <LoginForm returnTo={props.searchParams.returnTo} />;
}
