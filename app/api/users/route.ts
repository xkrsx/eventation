// TODO Work on editing profile, including changing password

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { updateUser } from '../../../database/users';
import {
  User,
  userEditSchema,
} from '../../../migrations/00000-createTableUsers';

type UserResponseBodyPut =
  | {
      user: Omit<User, 'createdAt'>;
    }
  | {
      error: string;
    };

export async function PUT(
  request: Request,
): Promise<NextResponse<UserResponseBodyPut>> {
  const requestBody = await request.json();

  // If client sends request body with incorrect data,
  // return a response with a 400 status code to the client
  const result = userEditSchema.safeParse(requestBody);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Request does not contain event object.',
        errorIssues: result.error.issues,
      },
      { status: 400 },
    );
  }

  // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  const updatedUser =
    sessionCookie &&
    (await updateUser(sessionCookie.value, {
      id: result.data.id,
      username: result.data.username,
      fullName: result.data.fullName,
      location: result.data.location,
      latitude: result.data.latitude,
      longitude: result.data.longitude,
      email: result.data.email,
      image: result.data.image,
    }));

  if (!updatedUser) {
    return NextResponse.json(
      {
        error: 'Profile not edited or access denied saving profile.',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ user: updatedUser });
}
