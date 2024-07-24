import dayjs from 'dayjs';
import Link from 'next/link';
import { Event } from '../../../database/events';
import { User } from '../../../migrations/00000-createTableUsers';
import EventImage from '../Images/EventImage/EventImage';

type Props = {
  event: Event;
  organiser: Omit<User, 'fullName' | 'categories' | 'email'>;

  attendantsCount: { count: string } | undefined;
};

export default function SingleEventNotLogged(props: Props) {
  return (
    <div>
      <h1>{props.event.name}</h1>
      <EventImage event={props.event} />
      <p>
        Organiser:{' '}
        <Link href={`/profile/${props.organiser.username}`}>
          {props.organiser.username}
        </Link>
      </p>
      <p>
        start: {dayjs(props.event.timeStart).format('dddd, HH:mm, DD/MM/YYYY')}
      </p>
      <p>end: {dayjs(props.event.timeEnd).format('dddd, HH:mm, DD/MM/YYYY')}</p>
      <p>price: {props.event.price}</p>
      <p>location: {props.event.location}</p>
      <p>category: {props.event.category}</p>
      <p>description: {props.event.description}</p>
      <p>
        number of attendants:{' '}
        {props.attendantsCount?.count
          ? props.attendantsCount.count
          : 'No one yet. Be first!'}
      </p>
      <strong>
        <Link href={`/profile?returnTo=/events/${props.event.id}`}>
          Log in to attend this event or chat with others.
        </Link>
      </strong>
    </div>
  );
}
