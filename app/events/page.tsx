// TODO all events for not logged in
// all + suggested events for logged in

import AllEventsByDate from './AllEventsByDate';
import AllEventsByPrice from './AllEventsByPrice';

export default function Events() {
  // TODO work on filtering/sorting results
  return (
    <div className="wrapper">
      <h1>All Events</h1>
      <h2>by Date</h2>
      <AllEventsByDate />
      <h2>by Price</h2>
      <AllEventsByPrice />
    </div>
  );
}
