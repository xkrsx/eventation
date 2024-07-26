import Image from 'next/image';
import Link from 'next/link';
import logoPic from '../../../public/images/logo-150x60.webp';
import Nav from '../Nav/Nav';

export default function Header() {
  return (
    <div className="wrapper">
      <div className="header">
        <Link href="/">
          <Image src={logoPic} alt="Eventation logo" />
        </Link>
        {' | '}
        <Link href="/categories">Categories</Link>
        {' | '}
        <Link href="/events">Events</Link>
        {' | '}
        <Nav />
      </div>
    </div>
  );
}
