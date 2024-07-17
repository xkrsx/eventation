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
import {
  checkStatus,
  countAttendantsInsecure,
} from '../../../database/usersEventsStatus';
import AttendanceStatusForm from '../../common/AttendanceStatusForm/AttendanceStatusForm';

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
  if (!session) {
    return;
  }

  const event = await getSingleEventInsecure(Number(props.params.eventId));
  if (!event) {
    redirect('/events/find');
  }

  const attendantsCount = await countAttendantsInsecure(event.id);

  // TODO FIX when there's no organiser profile
  const organiser = await getUserPublicByIdInsecure(event.userId);
  if (!organiser) {
    redirect(`/events/find`);
  }

  let methodAPI = 'PUT';

  const attendance = await checkStatus(
    session.token,
    Number(session.userId),
    Number(props.params.eventId),
  );

  if (!attendance) {
    methodAPI = 'POST';
  } else if (!!attendance.isAttending) {
    methodAPI = 'PUT';
  }

  return (
    <div>
      <h1>{event.name}</h1>
      <p>
        Organiser:{' '}
        <Link href={`/profile/${organiser.username}`}>
          {organiser.username}
        </Link>
      </p>
      <p>start: {dayjs(event.timeStart).format('dddd, HH:mm, DD/MM/YYYY')}</p>
      <p>end: {dayjs(event.timeEnd).format('dddd, HH:mm, DD/MM/YYYY')}</p>
      <p>price: {event.price}</p>
      <p>location: {event.location}</p>
      <p>category: {event.category}</p>
      <p>description: {event.description}</p>
      <p>
        number of attendants:{' '}
        {attendantsCount?.count
          ? attendantsCount.count
          : 'No one yet. Be first!'}
      </p>
      {session.userId === organiser.id ? (
        <button>edit</button>
      ) : (
        <AttendanceStatusForm
          session={session}
          event={event}
          isOrganising={false}
          isAttending={attendance.isAttending}
          methodAPI={methodAPI}
        />
        // ''
      )}
    </div>
  );
}
