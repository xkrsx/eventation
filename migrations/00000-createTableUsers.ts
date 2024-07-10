import { Sql } from 'postgres';
import { z } from 'zod';

export const userRegistrationSchema = z
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
    // categories: z.array(z.string()),
    categories: z.string(),
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

export const userLoginSchema = z.object({
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

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE users (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      username varchar(30) NOT NULL UNIQUE,
      full_name varchar(100) NOT NULL,
      password_hash varchar(80) NOT NULL,
      location varchar(50),
      latitude varchar(50),
      longitude varchar(50),
      categories text,
      email varchar(80) NOT NULL UNIQUE,
      created_at timestamp DEFAULT now() NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE users`;
}
