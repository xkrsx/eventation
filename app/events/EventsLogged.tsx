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
  console.log(events);

  return (
    <div className="wrapper">
      <div className="events">
        {user?.location === '' ? (
          <div>
            <strong>Please add location to see events in your city.</strong>
            <Link href="/profile/edit">Edit your profile</Link>
          </div>
        ) : (
          <>
            <h1>Events in {user?.location}</h1>
            <div className="list">
              {events.map((event) => {
                return (
                  <SingleEventLogged key={`id-${event.id}`} event={event} />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
