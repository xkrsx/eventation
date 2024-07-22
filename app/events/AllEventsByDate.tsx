'use server';

import dayjs from 'dayjs';
import Link from 'next/link';
import { Event, getAllEventsSortDateInsecure } from '../../database/events';
import { getUserPublicByIdInsecure } from '../../database/users';
import { countAttendantsInsecure } from '../../database/usersEventsStatus';
import AttendanceStatusCheck from '../common/AttendanceStatus/AttendanceStatusCheck';
import AttendanceStatusForm from '../common/AttendanceStatus/AttendanceStatusForm';

export default async function AllEventsByDate() {
  // // 1. Check if sessionToken in cookies exists
  // const sessionCookie = cookies().get('sessionToken');

  // // 2. Check if the sessionToken from cookie is still valid in DB
  // const session = sessionCookie && (await getValidSession(sessionCookie.value));

  const events = (await getAllEventsSortDateInsecure()).map(
    async (event: Event) => {
      const organiser = await getUserPublicByIdInsecure(event.userId);

      const attendantsCount = await countAttendantsInsecure(event.id);

      return (
        <div key={`event-${event.id}`} style={{ border: '1px solid black' }}>
          <Link href={`/events/${event.id}`}>
            <h2>{event.name}</h2>
          </Link>
          <p>
            Organiser:{' '}
            <Link href={`/profile/${organiser!.username}`}>
              {organiser!.username}
            </Link>
          </p>
          <p>
            start: {dayjs(event.timeStart).format('dddd, HH:mm, DD/MM/YYYY')}
          </p>
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
          {/* <AttendanceStatusForm event={event} session={undefined} isOrganising={false} methodAPI={''} /> */}
          <p>
            <Link href={`/events/${event.id}`}>See more...</Link>
          </p>
        </div>
      );
    },
  );

  return <div className="events">{events}</div>;
}
