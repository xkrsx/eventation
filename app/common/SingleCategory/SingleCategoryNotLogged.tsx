import { Event } from '../../../database/events';
import SingleEventNotLogged from '../SingleEvent/SingleEventNotLogged';

type Props = {
  category: string;
  events: (Event | undefined)[];
};

export default function SingleCategoryNotLogged(props: Props) {
  const events = props.events;

  return (
    <div>
      <h1>All events from: {props.category}</h1>

      {events.map((event) => (
        <SingleEventNotLogged key={`id-${event!.id}`} event={event} />
      ))}
    </div>
  );
}
