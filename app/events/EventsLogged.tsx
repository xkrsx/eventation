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
    <div className="wrapper">
      {user?.location === '' ? (
        <div className="event">
          <h1>All events</h1>
          <div className="events">
            <strong>Please add location to see events in your city.</strong>
            <Link className="system-link" href="/profile/edit">
              Edit your profile
            </Link>
          </div>
        </div>
      ) : (
        <>
          <h1>Events in {user?.location}</h1>
          <div className="events">
            {events.length === 0 ? (
              <div className="event">
                <ul>
                  <li>
                    <strong>Sorry, no events found in {user?.location}</strong>
                  </li>
                  <li>
                    <Link className="system-link" href="/categories">
                      Browse categories
                    </Link>
                  </li>
                  <li>
                    <Link className="system-link" href="/events/add">
                      Add event
                    </Link>

                    <Link className="system-link" href="/events/find">
                      Find event
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              events.map((event) => {
                return (
                  <SingleEventLogged key={`id-${event.id}`} event={event} />
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
