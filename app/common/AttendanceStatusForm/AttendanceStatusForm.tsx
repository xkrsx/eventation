'use client';
import { useState } from 'react';
import { Event } from '../../../database/events';
import { Session } from '../../../migrations/00001-createTableSessions';

type Props = {
  session: Omit<Session, 'id'>;
  event: Event;
  isOrganising: boolean;
  methodAPI: string;
};

export default function AttendanceStatusForm(props: Props) {
  const [attendanceStatus, setAttendanceStatus] = useState('');

  function handleStatusChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (event.target.name === 'yes') {
      setAttendanceStatus('yes');
    }
    if (event.target.name === 'maybe') {
      setAttendanceStatus('maybe');
    }
    if (event.target.name === 'no') {
      setAttendanceStatus('no');
    }
    //     const response = await fetch('/api/users_events_status/'){
    // method: methodAPI,
    //     }
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
    </form>
  );
}
