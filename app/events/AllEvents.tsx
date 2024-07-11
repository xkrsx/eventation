import Link from 'next/link';
import { getAllEventsInsecure } from '../../database/events';

export default async function AllEvents() {
  const events = await getAllEventsInsecure();

  return (
    <div className="events">
      <h1>Events</h1>
      {events.map((event) => {
        return (
          <Link key={`event-${event.id}`} href={`/events/${event.id}`}>
            <div style={{ border: '1px solid black' }}>
              <h1>{event.name}</h1>
              <p>{/* {event.timeStart} - {event.timeEnd} */}</p>
              <p>price: {event.price}</p>
              <p>location: {event.location}</p>
              <p>category: {event.category}</p>
              <p>description: {event.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
