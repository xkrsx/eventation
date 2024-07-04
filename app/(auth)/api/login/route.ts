import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSessionInsecure } from '../../../../database/sessions';
import {
  getUserWithPasswordHashInsecure,
  User,
} from '../../../../database/users';
import { secureCookieOptions } from '../../../../util/cookies';

export type LoginResponseBodyPost =
  | {
      user: Pick<User, 'username'>;
    }
  | { errors: { message: string }[] };

// TODO how to use userSchema from migrations? Omit/Pick?
const userSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must have at least 3 characters.' })
    .max(30, { message: 'Username must have maximum 30 characters.' }),
  password: z
    .string()
    .min(4, { message: 'Password must be have least 4 characters.' })
    .max(10, { message: 'Username must have maximum 10 characters.' })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/, {
      message:
        'Password must have one uppercase letter, one lowercase letter, one number and one special character.',
    }),
});

export async function POST(
  request: NextRequest,
): Promise<NextResponse<LoginResponseBodyPost>> {
  // 1. Get the user data from the request
  const body = await request.json();

  // 2. Validate the user data with zod
  const result = userSchema.safeParse(body.user);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.issues },
      {
        status: 400,
      },
    );
  }

  // 3. Verify user credentials
  const userWithPasswordHash = await getUserWithPasswordHashInsecure(
    result.data.username,
  );

  if (!userWithPasswordHash) {
    return NextResponse.json(
      { errors: [{ message: 'Username or password invalid.' }] },
      {
        status: 500,
      },
    );
  }

  // // 4. Validate the user password by comparing with hashed password
  const passwordHash = await bcrypt.compare(
    result.data.password,
    userWithPasswordHash.passwordHash,
  );

  if (!passwordHash) {
    return NextResponse.json(
      { errors: [{ message: 'Username or password invalid.' }] },
      {
        status: 500,
      },
    );
  }

  // 5. Create session token
  const token = crypto.randomBytes(100).toString('base64');

  // 6. Insert token to session table
  const session = await createSessionInsecure(token, userWithPasswordHash.id);

  if (!session) {
    return NextResponse.json(
      { errors: [{ message: 'Sessions creation failed.' }] },
      {
        status: 401,
      },
    );
  }

  // 7. Send new session token cookie in the header
  cookies().set({
    name: 'sessionToken',
    value: session.token,
    ...secureCookieOptions,
  });

  // 8. Return the new user information without the password hash
  return NextResponse.json({
    user: { username: userWithPasswordHash.username },
  });
}
