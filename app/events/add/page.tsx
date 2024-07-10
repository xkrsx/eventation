import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSession } from '../../../database/sessions';
import { getUser } from '../../../database/users';
import AddEventForm from './AddEventForm';

export default async function AddEvent() {
  // 1. Check if sessionToken in cookies exists
  const sessionCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken from cookie is still valid in DB
  const session = sessionCookie && (await getValidSession(sessionCookie.value));

  // 3. Redirect to login if sessionToken cookie is invalid
  if (!session) {
    redirect('/login?returnTo=/events/add');
    return;
  }

  // 4. if the sessionToken cookie is valid, allow access to profile page

  const profile = await getUser(session.token);

  if (!profile) {
    redirect('/');
  }

  return <AddEventForm />;

  //   return (
  //     <div className="wrapper">
  //       <div className="event">
  //         <h1>Add event</h1>
  //         {/* TODO add API functionality */}
  //         {/* add picture upload */}
  //         {/* fix time editing */}
  //         {/* fix location */}
  //         {/* fix category */}

  //         <form>
  //           <label>
  //             Name
  //             <input />
  //           </label>
  //           <label>
  //             Start time
  //             <input type="time" />
  //             <input type="date" />
  //           </label>
  //           <label>
  //             End time
  //             <input type="time" />
  //             <input type="date" />
  //           </label>
  //           <label>
  //             Price
  //             <input type="number" />
  //           </label>
  //           <label>
  //             Description
  //             <input />
  //           </label>
  //           <label>
  //             Links
  //             <input />
  //           </label>
  //           <button>Add event</button>
  //         </form>
  //       </div>
  //     </div>
  //   );
}
