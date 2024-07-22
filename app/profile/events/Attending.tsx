import dayjs from 'dayjs';
import Link from 'next/link';
import { Event } from '../../../database/events';
import { checkStatus } from '../../../database/usersEventsStatus';
import { Session } from '../../../migrations/00001-createTableSessions';
import AttendanceStatusForm from '../../common/AttendanceStatus/AttendanceStatusForm';

type Props = {
  events: Event[];
  session: Omit<Session, 'id'>;
};

export default function AttendingEvents(props: Props) {
  return (
    <div className="attending">
      <h2>Attending</h2>
      {props.events.length >= 1 ? (
        props.events.map(async (event) => {
          const attendanceSessionCheck = await checkStatus(
            props.session.token,
            props.session.userId,
            Number(event.id),
          );

          const isOrganiser = props.session.userId === event.userId;
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
              <p>
                chat:{' '}
                <Link href={`/events/${event.id}/chat`}>event lounge</Link>
              </p>

              <AttendanceStatusForm
                event={event}
                session={props.session}
                isAttending={attendanceSessionCheck?.isAttending}
                isOrganising={isOrganiser}
                methodAPI="PUT"
              />

              <Link href={`/events/${event.id}`}>See more...</Link>
            </div>
          );
        })
      ) : (
        <div>
          <strong>There are currently no events you are attending.</strong>{' '}
          <Link href="/events/find">Find event</Link>
        </div>
      )}
    </div>
  );
}
