import { cache } from 'react';
import { sql } from './connect';

export type User = {
  id: number;
  username: string;
  fullName: string;
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  categories: [] | null;
  email: string;
  createdAt: Date;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

export const getUser = cache(async (sessionToken: string) => {
  const [user] = await sql<User[]>`
    SELECT
      users.id,
      users.username,
      users.full_name,
      users.location,
      users.latitude,
      users.longitude,
      users.email,
      users.created_at
    FROM
      users
      INNER JOIN sessions ON (
        sessions.token = ${sessionToken}
        AND expiry_timestamp > now()
      )
  `;
  return user;
});

export const getUserByUsernameInsecure = cache(async (username: string) => {
  const [user] = await sql<Pick<User, 'id' | 'username'>[]>`
    SELECT
      users.id,
      users.username
    FROM
      users
    WHERE
      username = ${username.toLowerCase()}
  `;
  return user;
});

export const getUserByEmailInsecure = cache(async (email: string) => {
  const [user] = await sql<Pick<User, 'id' | 'email'>[]>`
    SELECT
      users.id,
      users.email
    FROM
      users
    WHERE
      email = ${email.toLowerCase()}
  `;
  return user;
});

export const createUserInsecure = cache(
  async (newUser: Omit<User, 'id' | 'createdAt'>, passwordHash: string) => {
    const [user] = await sql<Omit<User, 'createdAt'>[]>`
      INSERT INTO
        users (
          username,
          password_hash,
          full_name,
          location,
          latitude,
          longitude,
          categories,
          email
        )
      VALUES
        (
          ${newUser.username.toLowerCase()},
          ${passwordHash},
          ${newUser.fullName},
          ${newUser.location},
          ${newUser.latitude},
          ${newUser.longitude},
          ${newUser.categories},
          ${newUser.email.toLowerCase()}
        )
      RETURNING
        users.id,
        users.username,
        users.full_name,
        users.location,
        users.latitude,
        users.longitude,
        users.categories,
        users.email
    `;
    return user;
  },
);

export const getUserWithPasswordHashInsecure = cache(
  async (username: string) => {
    const [user] = await sql<UserWithPasswordHash[]>`
      SELECT
        *
      FROM
        users
      WHERE
        username = ${username.toLowerCase()}
    `;
    return user;
  },
);
