import Link from 'next/link';
import { findSingleEventByCity } from '../../database/events';
import { getUserPublicById } from '../../database/users';
import { Session } from '../../migrations/00001-createTableSessions';
import SingleEventLogged from '../common/SingleEvent/SingleEventLogged';
import ProfileNotLogged from '../profile/notLogged';

type Props = {
  session: Omit<Session, 'id'>;
  searchParams: { returnTo?: string | string[] };
};

export default async function EventsLogged(props: Props) {
  const user = await getUserPublicById(
    props.session.token,
    props.session.userId,
  );
  if (!user) {
    return <ProfileNotLogged returnTo={props.searchParams.returnTo} />;
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
        return (<SingleEventLogged
        key={`id-${event.id}`}
          event={event}
          organiser={undefined}
          session={props.session}
          attendantsCount={undefined}
          attendanceSessionCheck={undefined}
        />;
)      })}
    </div>
  );
}
