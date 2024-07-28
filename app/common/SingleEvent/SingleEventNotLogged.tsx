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
      <div className="event-left">
        <h1>
          <Link href={`/events/${props.event.id}`}>{props.event.name}</Link>
        </h1>
        <a href={props.event.image} target="_blank" rel="noreferrer">
          <EventImage event={props.event} />
        </a>
      </div>
      <div className="event-right">
        <p>
          Organiser:{' '}
          <Link href={`/profile/${organiser.username}`}>
            {organiser.username}
          </Link>
        </p>
        <p>
          start:{' '}
          {dayjs(props.event.timeStart).format('dddd, HH:mm, DD/MM/YYYY')}
        </p>
        <p>
          end: {dayjs(props.event.timeEnd).format('dddd, HH:mm, DD/MM/YYYY')}
        </p>
        <p>price: {props.event.price}</p>
        <p>location: {props.event.location}</p>
        <p>
          category: <Link href="/categories">{props.event.category}</Link>
        </p>

        <div>
          <p>{props.event.description}</p>
          <p>
            <a target="_blank" rel="noreferrer" href={props.event.link}>
              {props.event.link}
            </a>
          </p>

          <p>
            number of attendants:{' '}
            {attendantsCount.count
              ? attendantsCount.count
              : 'No one yet. Be first!'}
          </p>
          <Link href={`/events/${props.event.id}`}>See more</Link>
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
    </div>
  );
}
