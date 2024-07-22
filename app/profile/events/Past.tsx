// TODO events as three different tabs: organising / attending / past
// shows only events that belong to logged user
'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { Event } from '../../../database/events';
import AttendanceStatusCheck from '../../common/AttendanceStatus/AttendanceStatusCheck';

type Props = {
  events: Event[];
};

export default function PastEvents(props: Props) {
  return (
    <div className="attending">
      <h2>Past</h2>
      {props.events.length >= 1 ? (
        props.events.map((event) => {
          return (
            <div
              key={`event-${event.id}`}
              style={{ border: '1px solid black' }}
            >
              <Link href={`/events/${event.id}`}>
                <h3>{event.name}</h3>
              </Link>
              <p>
                start:{' '}
                {dayjs(event.timeStart).format('dddd, HH:mm, DD/MM/YYYY')}
              </p>
              <p>
                end: {dayjs(event.timeEnd).format('dddd, HH:mm, DD/MM/YYYY')}
              </p>
              <p>price: {event.price}</p>
              <p>location: {event.location}</p>
              <p>category: {event.category}</p>
              <p>description: {event.description}</p>
              <AttendanceStatusCheck event={event} />
              <Link href={`/events/${event.id}`}>See more...</Link>
            </div>
          );
        })
      ) : (
        <div>
          <strong>There are currently no events you were attending.</strong>{' '}
          <Link href="/events/find">Find event</Link>
        </div>
      )}
    </div>
  );
}
