// authorised user (organiser) can edit selected event
// TODO add authorisation

import { cookies } from 'next/headers';
import Link from 'next/link';
import { getSingleEventInsecure } from '../../../../database/events';
import { getValidSession } from '../../../../database/sessions';
import { getUserPublicByIdInsecure } from '../../../../database/users';
import SingleEventLogged from '../../../common/SingleEvent/SingleEventLogged';
import SingleEventNotLogged from '../../../common/SingleEvent/SingleEventNotLogged';
import EditEventPreview from './EditEventPreview';

type Props = {
  params: {
    eventId: string;
  };
};

export default async function EditEvent(props: Props) {
  // // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  // // 2. Check if the sessionToken cookie is still valid
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // // 3. Get event info
  const event = await getSingleEventInsecure(Number(props.params.eventId));
  console.log(event);
  if (event === undefined) {
    <div>
      <strong>Event not found.</strong>{' '}
      <Link href="/events/add">Add new event</Link>
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

  // // 4. If the sessionToken cookie is invalid or doesn't exist, show single event for unlogged
  if (!session) {
    return <SingleEventNotLogged event={event} />;
  }

  // // 5. If the sessionToken cookie is valid, show single event for logged
  return <EditEventPreview event={event} />;
}
