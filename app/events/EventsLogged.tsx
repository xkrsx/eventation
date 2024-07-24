import Link from 'next/link';
import { redirect } from 'next/navigation';
import { findSingleEventByCity } from '../../database/events';
import {
  getUserPublicById,
  getUserPublicByIdInsecure,
} from '../../database/users';
import {
  checkStatus,
  countAttendantsInsecure,
} from '../../database/usersEventsStatus';
import { Session } from '../../migrations/00001-createTableSessions';
import SingleEventLogged from '../common/SingleEvent/SingleEventLogged';

type Props = {
  session: Omit<Session, 'id'>;
};

export default async function EventsLogged(props: Props) {
  const user = await getUserPublicById(
    props.session.token,
    props.session.userId,
  );
  if (!user) {
    <div>
      <strong>Sorry, no events found in your city.</strong>
      <Link href="/events/find">Find other events.</Link>
    </div>;
    return;
  }
  const events = await findSingleEventByCity(
    props.session.token,
    String(user.location),
    'date',
  );

  if (!events || !user.location) {
    <div>
      <strong>Sorry, no events found in your city.</strong>
      <Link href="/events/find">Find other events.</Link>
    </div>;
    return;
  }

  return (
    <div>
      <h1>Events in your city</h1>
      {events.map(async (event) => {
        const organiser = await getUserPublicByIdInsecure(event.userId);
        if (!organiser) {
          redirect(`/events/find`);
        }
        const attendanceSessionCheck = await checkStatus(
          props.session.token,
          props.session.userId,
          Number(event.id),
        );
        const attendantsCount = await countAttendantsInsecure(Number(event.id));
        return (
          <SingleEventLogged
            key={`id-${event.id}`}
            event={event}
            organiser={organiser}
            session={props.session}
            attendantsCount={attendantsCount}
            attendanceSessionCheck={attendanceSessionCheck}
          />
        );
      })}
    </div>
  );
}
