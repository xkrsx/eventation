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
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  async function handleStatusChange(event) {
    event.preventDefault();

    const response = await fetch(`/api/users_events_status/${props.event.id}`, {
      method: props.methodAPI,
      body: JSON.stringify({
        userId: props.session.userId,
        eventId: props.event.id,
        isOrganising: props.isOrganising,
        isAttending: event.target.name,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    router.refresh();

    const data = await response.json();

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
