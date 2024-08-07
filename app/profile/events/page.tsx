import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getUsersEventsAttending,
  getUsersEventsOrganising,
  getUsersEventsPast,
} from '../../../database/events';
import { getValidSession } from '../../../database/sessions';
import ThreeTabs from '../../common/Tabs/ThreeTabs';
import AttendingEvents from './Attending';
import OrganisingEvents from './Organising';
import PastEvents from './Past';

export default async function UserEvents() {
  // authentication
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // 3. Redirect to login if sessionToken cookie is invalid
  if (!session) {
    return redirect('/profile?returnTo=/profile/events');
  }

  // 4. if the sessionToken cookie is valid, allow access to events page
  const eventsOrganising = await getUsersEventsOrganising(session.token);
  const eventsAttending = await getUsersEventsAttending(
    session.token,
    session.userId,
  );
  const eventsPast = await getUsersEventsPast(session.token, session.userId);

  return (
    <div className="wrapper">
      <h1>User events</h1>
      <ThreeTabs
        tabOne={{
          comp: <OrganisingEvents events={eventsOrganising} />,
          name: 'Organising',
        }}
        tabTwo={{
          comp: <AttendingEvents events={eventsAttending} />,
          name: 'Attending',
        }}
        tabThree={{
          comp: <PastEvents events={eventsPast} />,
          name: 'Past',
        }}
      />
    </div>
  );
}
