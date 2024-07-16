'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Event } from '../../../database/events';
import { Session } from '../../../migrations/00001-createTableSessions';
import ErrorMessage from '../../ErrorMessage';

type Props = {
  session: Omit<Session, 'id'>;
  event: Event;
  isOrganising: boolean;
  methodAPI: string;
};

export default function AttendanceStatusForm(props: Props) {
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  async function handleStatusChange(event) {
    event.preventDefault();
    if (event.target.name === 'yes') {
      setAttendanceStatus(event.target.name);
    }
    if (event.target.name === 'maybe') {
      setAttendanceStatus('maybe');
    }
    if (event.target.name === 'no') {
      setAttendanceStatus('no');
    }
    // TODO FIX attendance status changes after 2nd click
    const response = await fetch(`/api/users_events_status/${props.event.id}`, {
      method: props.methodAPI,
      body: JSON.stringify({
        userId: props.session.userId,
        eventId: props.event.id,
        isOrganising: props.isOrganising,
        isAttending: attendanceStatus,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    router.refresh();

    const data = await response.json();
    console.log('data: ', data);

    if ('errors' in data) {
      setErrors(data.errors);
      return;
    }
  }

  return (
    <form>
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
