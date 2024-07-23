'use server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Event } from '../../../database/events';
import { getValidSession } from '../../../database/sessions';
import { checkStatus } from '../../../database/usersEventsStatus';
import AttendanceStatusForm from './AttendanceStatusForm';

type Props = {
  event: Event;
};

export default async function AttendanceStatusCheck(props: Props) {
  // // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // // 2. Check if the sessionToken from cookie is still valid in DB
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // // 2.5. if no event found, show error message
  if (!props.event.id) {
    return console.log('error');
  }
  // //. 2.5 if user not logged in, show link to login
  if (!session) {
    return NextResponse.json(
      {
        error: 'Not authorized access.',
      },
      { status: 403 },
    );
  }
  // // 3. Check if user is already attending
  const attendanceSessionCheck = await checkStatus(
    session.token,
    session.userId,
    props.event.id,
  );

  // // 3.5 if user is not attending, show buttons and set methodAPI to post
  if (!attendanceSessionCheck) {
    <AttendanceStatusForm
      event={props.event}
      session={session}
      methodAPI="POST"
      isOrganising={false}
      isAttending=""
    />;
  }
  // // 4. if user is organising, show message
  else if (attendanceSessionCheck.isOrganising) {
    <div>
      <strong>you're organising this event</strong>
    </div>;
  }

  // // 5. if user is attending, show buttons and set method to PUT
  else if (attendanceSessionCheck.isAttending) {
    <div>
      <AttendanceStatusForm
        event={props.event}
        session={session}
        isAttending={attendanceSessionCheck.isAttending}
        methodAPI="PUT"
        isOrganising={false}
      />
    </div>;
  }
}
