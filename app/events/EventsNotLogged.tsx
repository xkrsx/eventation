import { getAllEventsSortDateInsecure } from '../../database/events';
import SingleEventNotLogged from '../common/SingleEvent/SingleEventNotLogged';

export default async function EventsNotLogged() {
  const events = await getAllEventsSortDateInsecure();

  return (
    <div>
      <h1>All events</h1>
      {events.map((event) => {
        return <SingleEventNotLogged key={`id-${event.id}`} event={event} />;
      })}
    </div>
  );
}
