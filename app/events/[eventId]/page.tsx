// TODO single event page
// not logged in: authenticate after join/chat button
// logged in: can join/chat, can remove themselves from event
// organiser: edit/delete event

import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSingleEventInsecure } from '../../../database/events';
import { getValidSession } from '../../../database/sessions';
import { getUserPublicByIdInsecure } from '../../../database/users';

type Props = {
  params: {
    eventId: string;
  };
};

export default async function SingleEvent(props: Props) {
  // // Task: Protect the dashboard page and redirect to login if the user is not logged in

  // // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');
  // // 2. Check if the sessionToken cookie is still valid
  const session = sessionCookie && (await getValidSession(sessionCookie.value));
  // // 3. If the sessionToken cookie is invalid or doesn't exist, redirect to login with returnTo

  // if (!session) {
  //   redirect(`/login?returnTo=/events/${props.params.eventId}`);
  // }
  const event = await getSingleEventInsecure(Number(props.params.eventId));
  if (!event) {
    redirect('/');
  }

  const organiser = await getUserPublicByIdInsecure(event.userId);

  // 4. If the sessionToken cookie is valid, allow access to dashboard page
  return (
    <div>
      <h1>{event.name}</h1>
      <p>
        Organiser:{' '}
        <Link href={`/profile/${organiser!.username}`}>
          {organiser!.username}
        </Link>
      </p>
      <p>start: {dayjs(event.timeStart).format('dddd, HH:mm, DD/MM/YYYY')}</p>
      <p>end: {dayjs(event.timeEnd).format('dddd, HH:mm, DD/MM/YYYY')}</p>
      <p>price: {event.price}</p>
      <p>location: {event.location}</p>
      <p>category: {event.category}</p>
      <p>description: {event.description}</p>
      <button>YES</button> <button>MAYBE</button> <button>NO</button>{' '}
      {session ? <button>edit</button> : ''}
    </div>
  );
}
