import { cookies } from 'next/headers';
import Link from 'next/link';
import { getAllEventsSingleCategoryInsecure } from '../../../database/events';
import { getValidSession } from '../../../database/sessions';
import { getCategoryNameById } from '../../../util/categories';
import SingleEventLogged from '../../common/SingleEvent/SingleEventLogged';
import SingleEventNotLogged from '../../common/SingleEvent/SingleEventNotLogged';

type Props = {
  params: {
    categoryId: string;
  };
};

export default async function SingleCategoryFromParams(props: Props) {
  // // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  // // 2. Check if the sessionToken cookie is still valid
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // // 3. Get category name by id from params
  const categoryName = getCategoryNameById(Number(props.params.categoryId));

  if (categoryName === undefined) {
    return (
      <div>
        <strong>Sorry, category not found.</strong>
        <Link href="/events/find">Find event.</Link>
      </div>
    );
  }
  // // 4. Get all events from category
  const events = await getAllEventsSingleCategoryInsecure(categoryName);

  // // 5. if no events, show info; show events for not logged and logged
  return (
    <div>
      <h1>{categoryName}</h1>
      {events.length === 0 ? (
        <div>
          <strong>Sorry, no events found in this category.</strong>
          <Link href="/events/find">Find event.</Link>
        </div>
      ) : (
        events.map(
          (event) =>
            events.length >= 1 &&
            (session ? (
              <SingleEventLogged key={`id-${event.id}`} event={event} />
            ) : (
              <SingleEventNotLogged key={`id-${event.id}`} event={event} />
            )),
        )
      )}
    </div>
  );
}
