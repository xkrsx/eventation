'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Event } from '../../../database/events';
import { Session } from '../../../migrations/00001-createTableSessions';
import { UsersEventsStatusResponseBodyPut } from '../../api/usersEventsStatus/[eventId]/route';
import ErrorMessage from '../../ErrorMessage';

type Props = {
  session: Omit<Session, 'id'> | undefined;
  event: Event;
  isAttending?: string | undefined;
  isOrganising: boolean | undefined;
  methodAPI: string;
};

export default function AttendanceStatusForm(props: Props) {
  const [attendanceStatus, setAttendanceStatus] = useState(props.isAttending);
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  async function handleStatusChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    const response = await fetch(`/api/usersEventsStatus/${props.event.id}`, {
      method: props.methodAPI,
      body: JSON.stringify({
        userId: props.session?.userId,
        eventId: props.event.id,
        isOrganising: props.isOrganising,
        isAttending: event.currentTarget.name,
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
      {props.session !== undefined ? (
        attendanceStatus ? (
          <>
            <p>attending?</p>
            <strong>{attendanceStatus}</strong>
          </>
        ) : (
          <strong>you have not responded yet</strong>
        )
      ) : (
        ''
      )}
      <div className="attendance-buttons">
        <button
          className="button-confirm"
          onClick={handleStatusChange}
          name="yes"
        >
          YES
        </button>

        <button
          className="button-maybe"
          onClick={handleStatusChange}
          name="maybe"
        >
          MAYBE
        </button>

        <button className="button-no" onClick={handleStatusChange} name="no">
          NO
        </button>
      </div>

      {errors.map((error) => (
        <div className="error" key={`error-${error.message}`}>
          <ErrorMessage>{error.message}</ErrorMessage>
        </div>
      ))}
    </form>
  );
}
