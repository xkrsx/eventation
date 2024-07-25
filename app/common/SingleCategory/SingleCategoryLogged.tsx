import { Event } from '../../../database/events';
import SingleEventLogged from '../SingleEvent/SingleEventLogged';

type Props = {
  category: string;
  events: (Event | undefined)[];
};

export default function SingleCategoryLogged(props: Props) {
  const events = props.events;

  return (
    <div>
      <h1>All events from: {props.category}</h1>

      {events.map((event) => (
        <SingleEventLogged key={`id-${event!.id}`} event={event} />
      ))}
    </div>
  );
}
