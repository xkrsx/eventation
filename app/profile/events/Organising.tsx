// TODO events as three different tabs: organising / attending / past
// shows only events that belong to logged user

import Link from 'next/link';
import { Event } from '../../../database/events';

type Props = {
  events: Event[];
};

export default function OrganisingEvents(props: Props) {
  const events = props.events.map((event) => {
    return (
      <div key={`event-${event.id}`} style={{ border: '1px solid black' }}>
        <Link href={`/events/${event.id}`}>
          <h3>{event.name}</h3>
        </Link>
        <p>{/* {event.timeStart} - {event.timeEnd} */}</p>
        <p>price: {event.price}</p>
        <p>location: {event.location}</p>
        <p>category: {event.category}</p>
        <p>description: {event.description}</p>
        <Link href={`/events/${event.id}`}>See more...</Link>
      </div>
    );
  });
  return (
    <div className="organising">
      <h2>Organising</h2>
      {events}
    </div>
  );
}
