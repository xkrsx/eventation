'use server';

import { cookies } from 'next/headers';
import Link from 'next/link';
import { Event } from '../../../database/events';
import { getValidSession } from '../../../database/sessions';
import { checkStatus } from '../../../database/usersEventsStatus';
import AttendanceStatusForm from './AttendanceStatusForm';

type Props = {
  event: Event;
};

export default async function AttendanceStatusCheck(props: Props) {
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // 3. Check if user is already attending
  const attendanceSessionCheck =
    session &&
    (await checkStatus(session.token, session.userId, props.event.id));

  if (!session) {
    return (
      <strong>
        <Link href="/login?returnTo=/">Log in to attend the event.</Link>
      </strong>
    );
  }

  if (!attendanceSessionCheck) {
    return (
      <AttendanceStatusForm
        event={props.event}
        session={session}
        methodAPI="POST"
        isOrganising={false}
        isAttending=""
      />
    );
  }

  if (attendanceSessionCheck.isOrganising) {
    return (
      <div>
        <strong>you're organising this event</strong>
      </div>
    );
  }
  if (attendanceSessionCheck.isAttending) {
    return (
      <div>
        <AttendanceStatusForm
          event={props.event}
          session={session}
          isAttending={attendanceSessionCheck.isAttending}
          methodAPI="PUT"
          isOrganising={false}
        />
      </div>
    );
  }
}
