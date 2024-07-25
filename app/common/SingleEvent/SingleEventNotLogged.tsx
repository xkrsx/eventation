import dayjs from 'dayjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Event } from '../../../database/events';
import { getUserPublicByIdInsecure } from '../../../database/users';
import { countAttendantsInsecure } from '../../../database/usersEventsStatus';
import EventImage from '../Images/EventImage/EventImage';

type Props = {
  event: Event | undefined;
};

export default async function SingleEventNotLogged(props: Props) {
  if (!props.event) {
    return redirect('/events/find');
  }
  const organiser = await getUserPublicByIdInsecure(props.event.userId);
  if (!organiser) {
    redirect(`/events/find`);
  }
  const attendantsCount = await countAttendantsInsecure(Number(props.event.id));
  if (!attendantsCount) {
    return redirect('/profile?returnTo=/profile/events');
  }
  return (
    <div>
      <h1>{props.event.name}</h1>
      <EventImage event={props.event} />
      <p>
        Organiser:{' '}
        <Link href={`/profile/${organiser.username}`}>
          {organiser.username}
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
        {attendantsCount.count
          ? attendantsCount.count
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
