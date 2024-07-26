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

  const events = await findSingleEventByCity(
    props.session.token,
    String(user!.location),
    'date',
  );

  return (
    <div>
      <h1>Events in your city</h1>
      {user?.location === '' ? (
        <div>
          <strong>
            Please add default location to see events in your city.
          </strong>
          <Link href="/profile/edit">Edit your profile</Link>
        </div>
      ) : (
        events.map((event) => {
          return <SingleEventLogged key={`id-${event.id}`} event={event} />;
        })
      )}
    </div>
  );
}
