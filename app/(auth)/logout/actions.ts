'use server';
import { cookies } from 'next/headers';
import { deleteSession } from '../../../database/sessions';

export async function logout() {
  // 1. Get the session token from the cookie
  const session = cookies().get('sessionToken');

  // 2. Delete the session from the DB
  if (session) await deleteSession(session.value);

  // 3. Delete the session cookie
  cookies().delete('sessionToken');
}
