import Link from 'next/link';
import { getAllEventsSortDateInsecure } from '../../database/events';
import SingleEventNotLogged from '../common/SingleEvent/SingleEventNotLogged';

export default async function EventsNotLogged() {
  const events = await getAllEventsSortDateInsecure();

  return (
    <div className="wrapper">
      <div className="events">
      <h1>All events</h1>
      <Link href="/profile?returnTo=/profile/events">
        Log or register to see events in your location
      </Link>

      {events.map((event) => {
        return <SingleEventNotLogged key={`id-${event.id}`} event={event} />;
      })}
    </div>
  );
}
