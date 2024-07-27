import './Header.scss';
import Image from 'next/image';
import Link from 'next/link';
// import logoPic from '../../../public/images/logo-293-120.webp';
import Nav from '../Nav/Nav';

export default function Header() {
  return (
    <div className="wrapper">
      <div className="header">
        <div>
          <Link href="/">
            <Image
              src="/images/logo-293-120.webp"
              alt="Eventation logo"
              width="293"
              height="120"
            />
          </Link>
          <div className="links-left">
            <Link href="/categories">Categories</Link>
            <Link href="/events">Events</Link>
          </div>
        </div>
        <Nav />
      </div>
    </div>
  );
}
