'use server';

import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Event, getAllEventsSortDateInsecure } from '../../database/events';
import { getValidSession } from '../../database/sessions';
import { getUserPublicByIdInsecure } from '../../database/users';
import { checkStatus } from '../../database/usersEventsStatus';
import AttendanceStatusForm from '../common/AttendanceStatusForm/AttendanceStatusForm';

export default async function AllEventsByDate() {
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  const events = (await getAllEventsSortDateInsecure()).map(
    async (event: Event) => {
      const organiser = await getUserPublicByIdInsecure(event.userId);

      // const showStatus = await AttendanceStatus(session, event.id);

      const attendanceStatus =
        session && (await checkStatus(session.token, session.userId, event.id));

      function showStatus() {
        if (attendanceStatus?.isOrganising) {
          return `you're organising this event`;
        } else if (attendanceStatus?.isAttending) {
          return (
            <div>
              <AttendanceStatusForm
                event={event}
                session={session}
                isOrganising={false}
                isAttending={attendanceStatus.isAttending}
                methodAPI="PUT"
              />
            </div>
          );
        } else if (!attendanceStatus) {
          return (
            <AttendanceStatusForm
              event={event}
              session={session}
              methodAPI="POST"
            />
          );
        }
      }

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
          {session ? (
            <strong>{showStatus()}</strong>
          ) : (
            <strong>
              <Link href="/login">Log in to attend the event.</Link>
            </strong>
          )}
          <p>
            <Link href={`/events/${event.id}`}>See more...</Link>
          </p>
        </div>
      );
    },
  );

  return <div className="events">{events}</div>;
}
