import './Footer.scss';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className="footer">
      <div className="about">
        <p>2024 Jakub Markiewicz</p>
        <Link href="https://github.com/xkrsx">github.com/xkrsx</Link>
      </div>
      <div className="nav">
        {/* <div> */}
        <Link href="/categories">categories</Link>
        <Link href="/events">all events</Link>
        {/* </div> */}
        {/* <div> */}
        <Link href="/events/add">add</Link>
        <Link href="/events/find">find</Link>
        {/* </div> */}
        {/* <div> */}
        <Link href="/profile/events">my events</Link>
        <Link href="/profile">my profile</Link>
        {/* </div> */}
      </div>
    </div>
  );
}
