import { Event } from '../../../database/events';
import SingleEventLogged from '../SingleEvent/SingleEventLogged';

type Props = {
  events: (Event | undefined)[];
};

export default function SingleCategoryLogged(props: Props) {
  const events = props.events;

  return (
    <div>
      {/* TODO ! */}

      <h1>All events from: 'category.name'</h1>

      {events.map((event) => (
        <SingleEventLogged key={`id-${event!.id}`} event={event} />
      ))}
    </div>
  );
}
