import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSessionInsecure } from '../../../../database/sessions';
import {
  createUserInsecure,
  getUserByEmailInsecure,
  getUserByUsernameInsecure,
  User,
} from '../../../../database/users';
import { secureCookieOptions } from '../../../../util/cookies';

export type RegisterResponseBodyPost =
  | {
      user: Omit<User, 'createdAt'>;
    }
  | { errors: { message: string }[] };

// const categoriesSchema = z.object(string);

const userSchema = z
  .object({
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
    confirmPassword: z
      .string()
      .min(4, { message: 'Password must be have least 4 characters.' })
      .max(10, { message: 'Username must have maximum 10 characters.' })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/, {
        message:
          'Password must have one uppercase letter, one lowercase letter, one number and one special character.',
      }),
    fullName: z
      .string()
      .min(3, { message: 'Name must have at least 3 characters.' })
      .max(100, { message: 'Name must have maximum 100 characters.' }),
    location: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    categories: z.array(z.string()),
    email: z
      .string()
      .min(3, { message: 'E-mail must have at least 3 characters.' })
      .max(80, { message: 'E-mail must have maximum 80 characters.' })
      .email({ message: 'E-mail must a valid address.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export async function POST(
  request: NextRequest,
): Promise<NextResponse<RegisterResponseBodyPost>> {
  // 1. Get the user data from the request
  const body = await request.json();

  // 2. Validate the user data with zod
  const result = userSchema.safeParse(body.newUser);

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
