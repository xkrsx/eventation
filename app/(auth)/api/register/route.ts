import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createSessionInsecure } from '../../../../database/sessions';
import {
  createUserInsecure,
  getUserByEmailInsecure,
  getUserByUsernameInsecure,
  User,
} from '../../../../database/users';
import { userRegistrationSchema } from '../../../../migrations/00000-createTableUsers';
import { secureCookieOptions } from '../../../../util/cookies';

export type RegisterResponseBodyPost =
  | {
      user: Omit<User, 'createdAt'>;
    }
  | { errors: { message: string }[] };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<RegisterResponseBodyPost>> {
  // 1. Get the user data from the request
  const body = await request.json();

  // 2. Validate the user data with zod
  const result = userRegistrationSchema.safeParse(body.newUser);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.issues },
      {
        status: 400,
      },
    );
  }

  // 3. Check if username already exists in the database
  const newUsername = await getUserByUsernameInsecure(result.data.username);

  if (newUsername) {
    return NextResponse.json(
      { errors: [{ message: 'Username already taken.' }] },
      {
        status: 400,
      },
    );
  }

  // 3.5 Check if email already exists in the database
  const newEmail = await getUserByEmailInsecure(result.data.email);

  if (newEmail) {
    return NextResponse.json(
      { errors: [{ message: 'E-mail already registered.' }] },
      {
        status: 400,
      },
    );
  }

  // 4. Hash the plain password from the user
  const passwordHash = await bcrypt.hash(result.data.password, 12);

  // 5. Save the user information with the hashed password in the database
  const newUser = await createUserInsecure(result.data, passwordHash);

  if (!newUser) {
    return NextResponse.json(
      { errors: [{ message: 'Registration failed.' }] },
      {
        status: 500,
      },
    );
  }

  // 6. Create session token
  const token = crypto.randomBytes(100).toString('base64');

  // 7. Insert token to session table
  const session = await createSessionInsecure(token, newUser.id);

  if (!session) {
    return NextResponse.json(
      { errors: [{ message: 'Sessions creation failed.' }] },
      {
        status: 401,
      },
    );
  }

  // 8. Send new session token cookie in the header
  cookies().set({
    name: 'sessionToken',
    value: session.token,
    ...secureCookieOptions,
  });

  // 8. Return the new user information without the password hash
  return NextResponse.json({ user: newUser });
}
