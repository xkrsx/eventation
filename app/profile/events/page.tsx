// TODO events as three different tabs: organising / attending / past
// shows only events that belong to logged user

import AttendingEvents from './Attending';
import OrganisingEvents from './Organising';
import PastEvents from './Past';

export default function UserEvents() {
  return (
    <div className="wrapper">
      <h1>User events</h1>
      <OrganisingEvents />
      <AttendingEvents />
      <PastEvents />
    </div>
  );
}
