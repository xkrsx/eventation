import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import * as React from 'react';
import { getEventLoungeLastHourMessages } from '../../../../database/chat/eventLounge';
import { getInfoStreamLastHourMessages } from '../../../../database/chat/infoStream';
import { getSingleEventInsecure } from '../../../../database/events';
import { getValidSession } from '../../../../database/sessions';
import {
  checkStatus,
  countAttendantsInsecure,
} from '../../../../database/usersEventsStatus';
import AttendanceStatusForm from '../../../common/AttendanceStatus/AttendanceStatusForm';
import TwoTabs from '../../../common/Tabs/TwoTabs';
import EventLounge from './EventLounge';
import InfoStream from './InfoStream';

type Props = {
  params: {
    eventId: string;
  };
};

export default async function EventChat(props: Props) {
  // // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  // // 2. Check if the sessionToken cookie is still valid
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  const event = await getSingleEventInsecure(Number(props.params.eventId));
  if (!event) {
    redirect('/events/find');
  }

  // // 3. If the sessionToken cookie is invalid or doesn't exist, show link to log in
  if (!session) {
    return (
      <div>
        <h1>{event.name}</h1>
        <Link href={`/events/${event.id}`}>See more about this event...</Link>
        {' | '}
        <Link href={`/login?returnTo=/events/${event.id}/chat`}>
          Log in to chat with others.
        </Link>
      </div>
    );
  }
  // // 3. check if user is attending the event
  const attendanceSessionCheck = await checkStatus(
    session.token,
    session.userId,
    Number(event.id),
  );

  if (!attendanceSessionCheck) {
    return (
      <AttendanceStatusForm
        event={event}
        session={session}
        isAttending={attendanceSessionCheck}
        isOrganising={false}
        methodAPI="POST"
      />
    );
  }

  // 4. If the sessionToken cookie is valid, show chat
  const eventLoungeMessages = await getEventLoungeLastHourMessages(
    session.token,
    Number(event.id),
  );
  const infoStreamMessages = await getInfoStreamLastHourMessages(
    session.token,
    Number(event.id),
  );
  function checkIfOrganiser() {
    if (session && event) {
      return session.userId === event.userId;
    }
  }
  const isOrganiser = checkIfOrganiser();
  const attendantsCount = await countAttendantsInsecure(event.id);

  return (
    <div>
      <h1>{event.name} Chat</h1>
      <p>start: {dayjs(event.timeStart).format('dddd, HH:mm, DD/MM/YYYY')}</p>
      <p>end: {dayjs(event.timeEnd).format('dddd, HH:mm, DD/MM/YYYY')}</p>
      <p>location: {event.location}</p>
      <p>
        {Number(attendantsCount?.count) <= 1
          ? `Number of attendants: ${attendantsCount?.count}`
          : `You and ${Number(attendantsCount?.count) - 1} other users are attending`}
      </p>

      <TwoTabs
        tabOne={{
          comp: (
            <EventLounge
              key="eventLounge"
              messages={eventLoungeMessages}
              currentUserId={session.userId}
              eventId={Number(event.id)}
            />
          ),
          name: 'EventLounge',
        }}
        tabTwo={{
          comp: (
            <InfoStream
              key="infoStream"
              messages={infoStreamMessages}
              currentUserId={session.userId}
              eventId={Number(event.id)}
              isOrganiser={isOrganiser}
            />
          ),
          name: 'InfoStream',
        }}
      />
    </div>
  );
}
