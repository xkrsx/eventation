'use client';
import { useState } from 'react';
import { Event } from '../../../database/events';
import { updateStatus } from '../../../database/usersEventsStatus';
import { Session } from '../../../migrations/00001-createTableSessions';

type Props = {
  session: Omit<Session, 'id'>;
  event: Event;
};

export default function AttendanceStatusForm(props: Props) {
  const [attendanceStatus, setAttendanceStatus] = useState('');

  const handleStatusChange = (event) => {
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
    return updateStatus(
      props.session.token,
      props.session.userId,
      props.event.id,
    );
  };

  return (
    <form>
      <ul>
        <li>
          <button name="yes">YES</button>
        </li>
        <li>
          <button name="maybe">MAYBE</button>
        </li>
        <li>
          <button name="no">NO</button>
        </li>
      </ul>
    </form>
  );
}
