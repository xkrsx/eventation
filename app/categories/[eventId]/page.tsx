import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAllEventsSingleCategoryInsecure } from '../../../database/events';
import { getValidSession } from '../../../database/sessions';
import { getCategoryNameById } from '../../../util/categories';
import SingleEventLogged from '../../common/SingleEvent/SingleEventLogged';
import SingleEventNotLogged from '../../common/SingleEvent/SingleEventNotLogged';

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

  const categoryName = getCategoryNameById(Number(props.params.eventId));

  if (categoryName === undefined) {
    return (
      <div>
        <strong>Sorry, category not found.</strong>
        <Link href="/events/find">Find event.</Link>
      </div>
    );
  }
  // // 3. Get event info
  const events = await getAllEventsSingleCategoryInsecure(categoryName);
  console.log(events);

  // // 4. If the sessionToken cookie is invalid or doesn't exist, show single event for unlogged

  return (
    <div>
      <h1>{categoryName}</h1>
      {events.length < 1 ? (
        <div>
          <strong>Sorry, no events not found.</strong>
          <Link href="/events/find">Find event.</Link>
        </div>
      ) : (
        events.map((event) =>
          events.length >= 1 && session ? (
            <SingleEventLogged key={`id-${event.id}`} event={event} />
          ) : (
            <SingleEventNotLogged key={`id-${event.id}`} event={event} />
          ),
        )
      )}
    </div>
  );
}
