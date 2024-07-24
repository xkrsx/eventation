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
import AttendanceStatusForm from '../../common/AttendanceStatus/AttendanceStatusForm';
import EventImage from '../../common/Images/EventImage/EventImage';
import SingleEventLogged from '../../common/SingleEvent/SingleEventLogged';

type Props = {
  params: {
    eventId: string;
  };
};

export default async function SingleEventFromParams(props: Props) {
  // // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  // // 2. Check if the sessionToken cookie is still valid
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // // 3. Get event info
  const event = await getSingleEventInsecure(Number(props.params.eventId));
  if (!event) {
    redirect('/events/find');
  }
  const organiser = await getUserPublicByIdInsecure(event.userId);
  if (!organiser) {
    redirect(`/events/find`);
  }
  const attendantsCount = await countAttendantsInsecure(event.id);

  // // 4. If the sessionToken cookie is invalid or doesn't exist, show link to log in
  if (!session) {
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
        <strong>
          <Link href={`/profile?returnTo=/events/${event.id}`}>
            Log in to attend this event or chat with others.
          </Link>
        </strong>
      </div>
    );
  }

  // // 5. If the sessionToken cookie is valid, check attendance status, show buttons and chat if attending

  const attendanceSessionCheck = await checkStatus(
    session.token,
    session.userId,
    Number(props.params.eventId),
  );

  return (
    <SingleEventLogged
      event={event}
      organiser={organiser}
      session={session}
      attendantsCount={attendantsCount}
      attendanceSessionCheck={attendanceSessionCheck}
    />
  );
}
