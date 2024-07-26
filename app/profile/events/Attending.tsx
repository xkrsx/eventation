import Link from 'next/link';
import { Event } from '../../../database/events';
import SingleEventLogged from '../../common/SingleEvent/SingleEventLogged';

type Props = {
  events: Event[];
};

export default function AttendingEvents(props: Props) {
  return (
    <div className="attending">
      <h2>Attending</h2>
      {props.events.length >= 1 ? (
        props.events.map((event) => {
          return <SingleEventLogged key={`id-${event.id}`} event={event} />;
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
