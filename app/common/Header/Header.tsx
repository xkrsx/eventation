import './Header.scss';
import Image from 'next/image';
import Link from 'next/link';
import logoPic from '../../../public/images/logo-1028-412.webp';
import Nav from '../Nav/Nav';

export default function Header() {
  return (
    <div className="wrapper">
      <div className="header">
        <div className="logo-icons">
          <Link href="/">
            <Image
              src={logoPic}
              alt="Eventation logo"
              height="103"
              width="257"
            />
          </Link>

          <Link href="/categories">
            <svg
              className="menu-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
            >
              <title id="categoriesTitle">Link to Categories</title>
              <desc id="categoriesDesc">
                Link to the list of all event categories.
              </desc>
              <path d="m261-526 220-354 220 354H261ZM706-80q-74 0-124-50t-50-124q0-74 50-124t124-50q74 0 124 50t50 124q0 74-50 124T706-80Zm-586-25v-304h304v304H120Zm586.08-35Q754-140 787-173.08q33-33.09 33-81Q820-302 786.92-335q-33.09-33-81-33Q658-368 625-334.92q-33 33.09-33 81Q592-206 625.08-173q33.09 33 81 33ZM180-165h184v-184H180v184Zm189-421h224L481-767 369-586Zm112 0ZM364-349Zm342 95Z" />
            </svg>
          </Link>
          <Link href="/events">
            <svg
              className="menu-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
            >
              <title id="eventsTitle">Link to Events</title>
              <desc id="eventsDesc">
                Link to the list of all events: unlogged user see all events,
                logged users see events in their city.
              </desc>
              <path d="m376-318 104-81 104 81-40-128 98-82H522l-42-122-42 122H318l98 82-40 128ZM140-160q-25 0-42.5-17.5T80-220v-132q0-10 5.5-17.5T100-380q31-11 48.5-39.5T166-480q0-31-17.5-60T100-580q-9-3-14.5-10.5T80-608v-132q0-25 17.5-42.5T140-800h680q25 0 42.5 17.5T880-740v132q0 10-5.5 17.5T860-580q-31 11-48.5 40T794-480q0 32 17.5 60.5T860-380q9 3 14.5 10.5T880-352v132q0 25-17.5 42.5T820-160H140Zm0-60h680v-109q-38-26-62-65t-24-86q0-47 24-86t62-65v-109H140v109q39 26 62.5 65t23.5 86q0 47-23.5 86T140-329v109Zm340-260Z" />
            </svg>
          </Link>
        </div>
        <Nav />
      </div>
    </div>
  );
}
