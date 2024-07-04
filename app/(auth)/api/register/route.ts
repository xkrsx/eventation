import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createUserInsecure,
  getUserByEmailInsecure,
  getUserByUsernameInsecure,
  User,
} from '../../../../database/users';

export type RegisterResponseBodyPost =
  | {
      user: Omit<User, 'createdAt'>;
    }
  | { errors: { message: string }[] };

const userSchema = z.object({
  username: z.string().min(3).max(30),
  password: z
    .string()
    .min(4)
    .max(10)
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/),
  fullName: z.string().min(3).max(100),
  location: z.string().min(2).max(50),
  email: z.string().email().max(80),
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

  // TODO password confirmation
  // use zod refine

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

  return NextResponse.json({ user: newUser });
}
