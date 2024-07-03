import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { User } from '../../../database/users';

type RegisterResponseBodyPost =
  | {
      user: User;
    }
  | { errors: { message: string }[] };

const userSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(3),
  fullName: z.string().max(100),
  location: z.string().max(50),
  email: z.string().email().max(80),
  createdAt: z.date(),
});

export async function POST(
  request: NextRequest,
): Promise<NextResponse<RegisterResponseBodyPost>> {
  const body = await request.json();
  const result = userSchema.safeParse(body);
}
