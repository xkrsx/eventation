import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSession } from '../../database/sessions';
import { getUserPublicByIdInsecure } from '../../database/users';
import {
  checkStatus,
  countAttendantsInsecure,
} from '../../database/usersEventsStatus';
import EventsLogged from './EventsLogged';
import EventsNotLogged from './EventsNotLogged';

type Props = {
  params: {
    eventId: string;
  };
};

export default async function Events(props: Props) {
  // // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  // // 2. Check if the sessionToken cookie is still valid
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // // 3. If the sessionToken cookie is invalid or doesn't exist, show all the events
  const organiser = await getUserPublicByIdInsecure(event.userId);
  if (!organiser) {
    redirect(`/events/find`);
  }

  if (!session) {
    return <EventsNotLogged />;
  }

  // // 4. if the sessiontoken is valid, show events in the city
  const attendanceSessionCheck = await checkStatus(
    session.token,
    session.userId,
    Number(props.params.eventId),
  );
  const attendantsCount = await countAttendantsInsecure(
    Number(props.params.eventId),
  );
  return (
    <EventsLogged
      session={session}
      organiser={organiser}
      attendantsCount={attendantsCount}
      attendanceSessionCheck={attendanceSessionCheck}
    />
  );
}
