import { cookies } from 'next/headers';
import Link from 'next/link';
import LogoutButton from '../../(auth)/logout/LogoutButton';
import { getUser } from '../../../database/users';

export default async function Nav() {
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB
  const user = sessionCookie && (await getUser(sessionCookie.value));

  return (
    <div className="nav">
      <Link href="/">Main stage</Link>
      {' | '}
      <Link href="/categories">Categories</Link>
      {' | '}
      <Link href="/events">Events</Link>
      {' | '}
      <Link href="/events/add">Add</Link>
      {' | '}
      <Link href="/events/find">Find</Link>
      {' | '}
      <Link href="/profile/events">My Events</Link>
      {' | '}
      {user ? (
        <>
          <Link href="/profile">{user.username}</Link>
          <LogoutButton />
        </>
      ) : (
        <Link href="/profile">Profile</Link>
      )}
    </div>
  );
}
