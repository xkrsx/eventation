import Link from 'next/link';
import { Event } from '../../../database/events';
import SingleEventLogged from '../../common/SingleEvent/SingleEventLogged';

type Props = {
  events: Event[];
};

export default function PastEvents(props: Props) {
  return (
    <div className="attending">
      <h2>Past</h2>
      {props.events.length === 0 ? (
        <div>
          <strong>There are currently no events you were attending.</strong>{' '}
          <Link href="/events/find">Find event</Link>
        </div>
      ) : (
        props.events.map((event) => {
          return <SingleEventLogged key={`id-${event.id}`} event={event} />;
        })
      )}
    </div>
  );
}
