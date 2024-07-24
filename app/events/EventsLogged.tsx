import Link from 'next/link';
import { findSingleEventByCity } from '../../database/events';
import { getUserPublicById } from '../../database/users';
import { UsersEventsStatus } from '../../database/usersEventsStatus';
import { User } from '../../migrations/00000-createTableUsers';
import { Session } from '../../migrations/00001-createTableSessions';
import SingleEventLogged from '../common/SingleEvent/SingleEventLogged';

type Props = {
  session: Omit<Session, 'id'>;
  organiser: Omit<User, 'fullName' | 'categories' | 'email'>;
  attendantsCount: { count: string } | undefined;
  attendanceSessionCheck: UsersEventsStatus | undefined;
};

export default async function EventsLogged(props: Props) {
  const user = await getUserPublicById(
    props.session.token,
    props.session.userId,
  );
  if (!user) {
    // TODO
  }
  const events = await findSingleEventByCity(
    props.session.token,
    user.location,
    'date',
  );

  if (!events) {
    <div>
      <strong>Sorry, no events found in your city.</strong>
      <Link href="/events/find">Find other events.</Link>
    </div>;
    return;
  }

  return (
    <div>
      <h1>Events in your city</h1>
      {events.map((event) => {
        return (
          <SingleEventLogged
            key={`id-${event.id}`}
            event={event}
            organiser={props.organiser}
            session={props.session}
            attendantsCount={props.attendantsCount}
            attendanceSessionCheck={props.attendanceSessionCheck}
          />
        );
      })}
    </div>
  );
}
