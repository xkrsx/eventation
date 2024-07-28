import './Events.scss';
import Link from 'next/link';
import { Event } from '../../../database/events';
import SingleEventLogged from '../../common/SingleEvent/SingleEventLogged';

type Props = {
  events: Event[];
};

export default function AttendingEvents(props: Props) {
  return (
    <div className="events">
      {props.events.length === 0 ? (
        <div className="event">
          <strong>There are currently no events you are attending.</strong>{' '}
          <Link href="/events/find">Find event</Link>
        </div>
      ) : (
        props.events.map((event) => {
          return (
            <div className="event" key={`id-${event.id}`}>
              <SingleEventLogged event={event} />
            </div>
          );
        })
      )}
    </div>
  );
}
