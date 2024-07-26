import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { deleteSession } from '../../../../database/sessions';
import { deleteUser } from '../../../../database/users';
import { User } from '../../../../migrations/00000-createTableUsers';

type UserParams = {
  params: {
    userId: string;
  };
};
// TODO Work on editing profile, including changing password

// type UserResponseBodyPut =
//   | {
//       user: User;
//     }
//   | {
//       error: string;
//     };

// export async function PUT(
//   request: Request,
//   { params }: UserParams,
// ): Promise<NextResponse<UserResponseBodyPut>> {
//   const requestBody = await request.json();

//   // If client sends request body with incorrect data,
//   // return a response with a 400 status code to the client
//   const result = userEditSchema.safeParse(requestBody);

//   if (!result.success) {
//     return NextResponse.json(
//       {
//         error: 'Request does not contain event object.',
//         errorIssues: result.error.issues,
//       },
//       { status: 400 },
//     );
//   }

//   // 1. Checking if the sessionToken cookie exists
//   const sessionCookie = cookies().get('sessionToken');

//   const updatedUser =
//     sessionCookie &&
//     (await updateUser(sessionCookie.value, {
//       username: result.data.username,
//       fullName: result.data.fullName,
//       location: result.data.location,
//       latitude: result.data.latitude,
//       longitude: result.data.longitude,
//       categories: result.data.categories,
//       email: result.data.email,
//       passwordHash: result.data.newPassword,
//     }));

//   if (!updatedUser) {
//     return NextResponse.json(
//       {
//         error: 'Event not created or access denied creating events',
//       },
//       { status: 500 },
//     );
//   }

//   return NextResponse.json({ user: updatedUser });
// }

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
