import './page.scss';
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
      <div className="wrapper">
        <p>
          <Link className="system-link" href="/categories">
            categories
          </Link>
          /
        </p>
        <h1>Category not found</h1>
        <div className="category">
          <div className="event">
            <ul>
              <li>
                <Link className="system-link" href="/categories">
                  Browse categories
                </Link>
              </li>
              <li>
                <Link className="system-link" href="/events/find">
                  Find event
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  // // 4. Get all events from category
  const events = await getAllEventsSingleCategoryInsecure(categoryName);

  // // 5. if no events, show info; show events for not logged and logged
  return (
    <div className="wrapper">
      <p>
        <Link className="system-link" href="/categories">
          categories
        </Link>{' '}
        /
      </p>
      <h1>{categoryName}</h1>
      <div className="category">
        {events.length === 0 ? (
          <div className="event">
            <ul>
              <li>
                <strong>Sorry, no events found in this category</strong>
              </li>
              <li>
                <Link className="system-link" href="/categories">
                  Browse categories
                </Link>
              </li>
              <li>
                <Link className="system-link" href="/events/add">
                  Add event
                </Link>

                <Link className="system-link" href="/events/find">
                  Find event
                </Link>
              </li>
            </ul>
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
    </div>
  );
}
