'use server';

import './SingleEvent.scss';
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
    <div className="event">
      <div>
        <h1>
          <Link href={`/events/${props.event.id}`}>{props.event.name}</Link>
        </h1>
        <Link href={`/events/${props.event.id}`}>
          <EventImage event={props.event} />
        </Link>
        <p>
          <strong>Organiser:</strong>{' '}
          <Link href={`/profile/${organiser.username}`}>
            {organiser.username}
          </Link>
        </p>
        <p>
          <strong>start:</strong>{' '}
          {dayjs(props.event.timeStart).format('dddd, HH:mm, DD/MM/YYYY')}
        </p>
        <p>
          <strong>end:</strong>{' '}
          {dayjs(props.event.timeEnd).format('dddd, HH:mm, DD/MM/YYYY')}
        </p>
        <p>
          <strong>price:</strong> {props.event.price}
        </p>
        <p>
          <strong>location:</strong> {props.event.location}
        </p>
        <p>
          <strong>category:</strong> {props.event.category}
        </p>
        <p>
          <strong>description:</strong> {props.event.description}
        </p>
        <p>
          <strong>number of attendants:</strong>{' '}
          {attendantsCount.count
            ? attendantsCount.count
            : 'No one yet. Be first!'}
        </p>
      </div>
      <strong>
        <Link
          className="system-link center"
          href={`/profile?returnTo=/events/${props.event.id}`}
        >
          Log in to attend this event or chat with others.
        </Link>
      </strong>
    </div>
  );
}
