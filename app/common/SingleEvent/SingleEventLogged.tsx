'use server';

import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Event } from '../../../database/events';
import { getValidSession } from '../../../database/sessions';
import { getUserPublicByIdInsecure } from '../../../database/users';
import {
  checkStatus,
  countAttendantsInsecure,
} from '../../../database/usersEventsStatus';
import AttendanceStatusForm from '../AttendanceStatus/AttendanceStatusForm';
import EventImage from '../Images/EventImage/EventImage';

type Props = {
  event: Event;
};

export default async function SingleEventLogged(props: Props) {
  const sessionCookie = cookies().get('sessionToken');
  const session = sessionCookie && (await getValidSession(sessionCookie.value));
  if (!session) {
    return redirect('/profile?returnTo=/profile/events');
  }
  if (!props.event) {
    return redirect('/events/find');
  }

  const organiser = await getUserPublicByIdInsecure(props.event.userId);
  if (!organiser) {
    redirect(`/events/find`);
  }
  const attendanceSessionCheck = await checkStatus(
    session.token,
    session.userId,
    Number(props.event.id),
  );
  const attendantsCount = await countAttendantsInsecure(Number(props.event.id));
  if (!attendantsCount) {
    return redirect('/profile?returnTo=/profile/events');
  }

  return (
    <div>
      <h1>
        <Link href={`/events/${props.event.id}`}>{props.event.name}</Link>
      </h1>
      <Link href={`/events/${props.event.id}`}>
        <EventImage event={props.event} />
      </Link>
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
        link: <a href={props.event.link}>{props.event.link}</a>
      </p>

      <p>
        number of attendants:{' '}
        {attendantsCount.count
          ? attendantsCount.count
          : 'No one yet. Be first!'}
      </p>
      <Link href={`/events/${props.event.id}`}>See more</Link>

      {attendanceSessionCheck ? (
        session.userId === organiser.id ? (
          <div>
            <strong>You are an organiser</strong>
            <Link href={`/events/${props.event.id}/edit`}>
              Edit or delete this event
            </Link>
          </div>
        ) : (
          <div>
            <p>
              chat:{' '}
              <Link href={`/events/${props.event.id}/chat`}>
                event lounge & info stream
              </Link>
            </p>
            <AttendanceStatusForm
              event={props.event}
              session={session}
              isAttending={attendanceSessionCheck.isAttending}
              isOrganising={false}
              methodAPI="PUT"
            />
          </div>
        )
      ) : (
        <AttendanceStatusForm
          event={props.event}
          session={session}
          isOrganising={false}
          methodAPI="POST"
        />
      )}
    </div>
  );
}
