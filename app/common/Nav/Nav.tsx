import Link from 'next/link';
import LogoutButton from '../../(auth)/logout/LogoutButton';

export default function Nav() {
  return (
    <div className="nav">
      <Link href="/profile">Profile</Link>
      {' | '}
      <Link href="/login">Login</Link>
      {' | '}
      <Link href="/register">Register</Link>
      <LogoutButton />
    </div>
  );
}
