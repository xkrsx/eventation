import { Event } from '../../../database/events';
import SingleEventNotLogged from '../SingleEvent/SingleEventNotLogged';

type Props = {
  events: (Event | undefined)[];
};

export default function SingleCategoryNotLogged(props: Props) {
  const events = props.events;

  return (
    <div>
      {/* TODO ! */}
      <h1>All events from: 'category.name'</h1>

      {events.map((event) => (
        <SingleEventNotLogged key={`id-${event!.id}`} event={event} />
      ))}
    </div>
  );
}
