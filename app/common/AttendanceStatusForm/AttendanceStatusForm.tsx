'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Event } from '../../../database/events';
import { Session } from '../../../migrations/00001-createTableSessions';
import { UsersEventsStatusResponseBodyPut } from '../../api/users_events_status/[eventId]/route';
import ErrorMessage from '../../ErrorMessage';

type Props = {
  session: Omit<Session, 'id'> | undefined;
  event: Event;
  isOrganising?: boolean;
  isAttending?: string;
  methodAPI: string;
};

export default function AttendanceStatusForm(props: Props) {
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState(props.isAttending);

  const router = useRouter();

  async function handleStatusChange(event: any) {
    // event.preventDefault();
    const response = await fetch(`/api/users_events_status/${props.event.id}`, {
      method: props.methodAPI,
      body: JSON.stringify({
        userId: props.session?.userId,
        eventId: props.event.id,
        isOrganising: props.isOrganising,
        isAttending: event.target.name,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    router.refresh();

    const data: UsersEventsStatusResponseBodyPut = await response.json();

    if ('error' in data) {
      setErrors([{ message: data.error }]);
      return;
    }

    setAttendanceStatus(data.status.isAttending);
  }

  return (
    <form>
      {props.session !== undefined! ? (
        attendanceStatus ? (
          <strong>attending? {attendanceStatus}</strong>
        ) : (
          <strong>you have not responded yet</strong>
        )
      ) : (
        ''
      )}
      <ul>
        <li>
          <button onClick={handleStatusChange} name="yes">
            YES
          </button>
        </li>
        <li>
          <button onClick={handleStatusChange} name="maybe">
            MAYBE
          </button>
        </li>
        <li>
          <button onClick={handleStatusChange} name="no">
            NO
          </button>
        </li>
      </ul>
      {errors.map((error) => (
        <div className="error" key={`error-${error.message}`}>
          <ErrorMessage>{error.message}</ErrorMessage>
        </div>
      ))}
    </form>
  );
}
