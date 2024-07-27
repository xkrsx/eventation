import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { deleteSession } from '../../../../database/sessions';
import { deleteUser, updateUser } from '../../../../database/users';
import {
  User,
  userEditSchema,
} from '../../../../migrations/00000-createTableUsers';

type UserParams = {
  params: {
    userId: string;
  };
};

export type UserResponseBodyDelete =
  | {
      user: User;
    }
  | {
      error: string;
    };

export async function DELETE(
  request: Request,
  { params }: UserParams,
): Promise<NextResponse<UserResponseBodyDelete>> {
  // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');
  const user =
    sessionCookie &&
    (await deleteUser(sessionCookie.value, Number(params.userId)));

  // 2. Delete the session from the DB
  if (sessionCookie) await deleteSession(sessionCookie.value);

  // 3. Delete the session cookie
  cookies().delete('sessionToken');

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }
  return NextResponse.json({ user: user });
}
