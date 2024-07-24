import { getAllEventsSortDateInsecure } from '../../database/events';
import { getUserPublicByIdInsecure } from '../../database/users';
import { countAttendantsInsecure } from '../../database/usersEventsStatus';
import SingleEventNotLogged from '../common/SingleEvent/SingleEventNotLogged';

export default async function EventsNotLogged() {
  const events = await getAllEventsSortDateInsecure();

  return (
    <div>
      <h1>All events</h1>
      {events.map(async (event) => {
        const organiser = await getUserPublicByIdInsecure(event.userId);

        const attendantsCount = await countAttendantsInsecure(event.id);
        return (
          <SingleEventNotLogged
            key={`id-${event.id}`}
            event={event}
            organiser={organiser}
            attendantsCount={attendantsCount}
          />
        );
      })}
    </div>
  );
}
