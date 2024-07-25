import { cookies } from 'next/headers';
import Link from 'next/link';
import { getAllEventsSingleCategoryInsecure } from '../../../database/events';
import { getValidSession } from '../../../database/sessions';
import SingleCategoryLogged from '../../common/SingleCategory/SingleCategoryLogged';
import SingleCategoryNotLogged from '../../common/SingleCategory/SingleCategoryNotLogged';

type Props = {
  params: {
    eventId: string;
  };
};

export default async function SingleCategoryFromParams(props: Props) {
  // // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  // // 2. Check if the sessionToken cookie is still valid
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // // 3. Get event info
  const events = await getAllEventsSingleCategoryInsecure(
    Number(props.params.eventId),
  );
  console.log(events);

  // // 4. If the sessionToken cookie is invalid or doesn't exist, show single event for unlogged

  // TODO FIX when there are no events in category
  // // 5. If the sessionToken cookie is valid, show single event for logged
  return events.length > 1 ? (
    <div>
      <strong>Sorry, category not found.</strong>
      <Link href="/events/find">Find event.</Link>
    </div>
  ) : (
    <SingleCategoryLogged events={events} />
  );
}
