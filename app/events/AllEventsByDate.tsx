import dayjs from 'dayjs';
import Link from 'next/link';
import { Event, getAllEventsSortDateInsecure } from '../../database/events';
import { getUserPublicByIdInsecure } from '../../database/users';

export default async function AllEventsByDate() {
  const events = (await getAllEventsSortDateInsecure()).map(
    async (event: Event) => {
      const organiser = await getUserPublicByIdInsecure(event.userId);
      return (
        <div key={`event-${event.id}`} style={{ border: '1px solid black' }}>
          <Link href={`/events/${event.id}`}>
            <h2>{event.name}</h2>
          </Link>
          <p>
            Organiser:{' '}
            <Link href={`/profile/${organiser!.username}`}>
              {organiser!.username}
            </Link>
          </p>
          <p>
            start: {dayjs(event.timeStart).format('dddd, HH:mm, DD/MM/YYYY')}
          </p>
          <p>end: {dayjs(event.timeEnd).format('dddd, HH:mm, DD/MM/YYYY')}</p>
          <p>price: {event.price}</p>
          <p>location: {event.location}</p>
          <p>category: {event.category}</p>
          <p>description: {event.description}</p>
          <Link href={`/events/${event.id}`}>See more...</Link>
        </div>
      );
    },
  );

  return <div className="events">{events}</div>;
}