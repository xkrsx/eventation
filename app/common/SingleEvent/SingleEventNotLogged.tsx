import dayjs from 'dayjs';
import Link from 'next/link';
import { Event } from '../../../database/events';
import { UsersEventsStatus } from '../../../database/usersEventsStatus';
import { User } from '../../../migrations/00000-createTableUsers';
import { Session } from '../../../migrations/00001-createTableSessions';
import AttendanceStatusForm from '../AttendanceStatus/AttendanceStatusForm';
import EventImage from '../Images/EventImage/EventImage';

type Props = {
  event: Event;
  organiser: Omit<User, 'fullName' | 'categories' | 'email'>;
  session: Omit<Session, 'id'>;
  attendantsCount: { count: string } | undefined;
  attendanceSessionCheck: UsersEventsStatus | undefined;
};

export default function SingleEventLogged(props: Props) {
  return (
    <div>
      <h1>{props.event.name}</h1>
      <EventImage event={props.event} />
      <p>
        Organiser:{' '}
        <Link href={`/profile/${props.organiser.username}`}>
          {props.organiser.username}
        </Link>
      </p>
      <p>
        start: {dayjs(props.event.timeStart).format('dddd, HH:mm, DD/MM/YYYY')}
      </p>
      <p>end: {dayjs(props.event.timeEnd).format('dddd, HH:mm, DD/MM/YYYY')}</p>
      <p>price: {props.event.price}</p>
      <p>location: {props.event.location}</p>
      <p>category: {props.event.category}</p>
      <p>description: {props.event.description}</p>
      <p>
        link: <a href={props.event.link}>{props.event.link}</a>
      </p>

      <p>
        number of attendants:{' '}
        {props.attendantsCount!.count
          ? props.attendantsCount!.count
          : 'No one yet. Be first!'}
      </p>

      {props.attendanceSessionCheck ? (
        <div>
          <p>
            chat:{' '}
            <Link href={`/events/${props.event.id}/chat`}>
              event lounge & info stream
            </Link>
          </p>
          <AttendanceStatusForm
            event={props.event}
            session={props.session}
            isAttending={props.attendanceSessionCheck.isAttending}
            isOrganising={false}
            methodAPI="PUT"
          />
        </div>
      ) : (
        <AttendanceStatusForm
          event={props.event}
          session={props.session}
          isOrganising={false}
          methodAPI="POST"
        />
      )}
    </div>
  );
}
