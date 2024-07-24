import Link from 'next/link';
import { findSingleEventByCity } from '../../database/events';
import { getUserPublicById } from '../../database/users';
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
      {events.map((event) => {
        return <SingleEventLogged key={`id-${event.id}`} event={event} />;
      })}
    </div>
  );
}
