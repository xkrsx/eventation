// TODO all events for not logged in
// all + suggested events for logged in

import AllEvents from './AllEvents';

export default function Events() {
  return (
    <div className="wrapper">
      <h1>Events</h1>
      <AllEvents />
    </div>
  );
}
