'use server';

import { cookies } from 'next/headers';
import { getValidSession } from '../../../database/sessions';
import { checkStatus } from '../../../database/usersEventsStatus';
import { Session } from '../../../migrations/00001-createTableSessions';

export default async function AttendanceStatus(
  session: Session,
  eventId: number,
) {
  const attendanceStatus =
    session && (await checkStatus(session.token, session.userId, eventId));

  return function showStatus() {
    if (attendanceStatus?.isOrganising) {
      return `you're organising this event`;
    } else if (attendanceStatus?.isAttending) {
      return `attending? ${attendanceStatus.isAttending}`;
    } else {
      return 'you have not responded yet';
    }
  };
}
