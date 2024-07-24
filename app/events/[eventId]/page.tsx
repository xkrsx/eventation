import { cookies } from 'next/headers';
import Link from 'next/link';
import { getSingleEventInsecure } from '../../../database/events';
import { getValidSession } from '../../../database/sessions';
import { getUserPublicByIdInsecure } from '../../../database/users';
import {
  checkStatus,
  countAttendantsInsecure,
} from '../../../database/usersEventsStatus';
import SingleEventLogged from '../../common/SingleEvent/SingleEventLogged';
import SingleEventNotLogged from '../../common/SingleEvent/SingleEventNotLogged';

type Props = {
  params: {
    eventId: string;
  };
};

export default async function SingleEventFromParams(props: Props) {
  // // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  // // 2. Check if the sessionToken cookie is still valid
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // // 3. Get event info
  const event = await getSingleEventInsecure(Number(props.params.eventId));
  if (!event) {
    <div>
      <strong>Sorry, event not found.</strong>
      <Link href="/events/find">Find other event.</Link>
    </div>;
    return;
  }
  const organiser = await getUserPublicByIdInsecure(event.userId);
  if (!organiser) {
    <div>
      <strong>Sorry, an error occured.</strong>
      <Link href="/events/find">Find other event.</Link>
    </div>;
    return;
  }
  const attendantsCount = await countAttendantsInsecure(event.id);

  // // 4. If the sessionToken cookie is invalid or doesn't exist, show link to log in
  if (!session) {
    return (
      <SingleEventNotLogged
        event={event}
        organiser={organiser}
        attendantsCount={attendantsCount}
      />
    );
  }

  // // 5. If the sessionToken cookie is valid, check attendance status, show buttons and chat if attending
  const attendanceSessionCheck = await checkStatus(
    session.token,
    session.userId,
    Number(props.params.eventId),
  );

  return (
    <SingleEventLogged
      event={event}
      organiser={organiser}
      session={session}
      attendantsCount={attendantsCount}
      attendanceSessionCheck={attendanceSessionCheck}
    />
  );
}
