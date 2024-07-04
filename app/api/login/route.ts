import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserWithPasswordHashInsecure, User } from '../../../database/users';

export type LoginResponseBodyPost =
  | {
      user: Pick<User, 'username'>;
    }
  | { errors: { message: string }[] };

// TODO how to use userSchema from migrations? Omit/Pick?
const userSchema = z.object({
  username: z.string().min(3).max(30),
  password: z
    .string()
    .min(4)
    .max(10)
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/),
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
  console.log(userWithPasswordHash);

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

  // // 5. Save the user information with the hashed password in the database
  // const newUser = await createUserInsecure(result.data, passwordHash);

  // if (!newUser) {
  //   return NextResponse.json(
  //     { errors: [{ message: 'Registration failed.' }] },
  //     {
  //       status: 500,
  //     },
  //   );
  // }

  return NextResponse.json({
    user: { username: userWithPasswordHash.username },
  });
}
