import Link from 'next/link';

export default function RootNotFound() {
  return (
    <div>
      <h1>#404: Page not found!</h1>
      <p>Sorry, this page was not found.</p>
      <div>
        <ul>
          <li>
            <Link href="/events/find">Find event</Link>
          </li>
          <li>
            <Link href="/">MAIN STAGE</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
