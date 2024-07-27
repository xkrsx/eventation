import { cache } from 'react';
import { User } from '../migrations/00000-createTableUsers';
import { sql } from './connect';

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

// logged profile
export const getUser = cache(async (sessionToken: string) => {
  const [user] = await sql<User[]>`
    SELECT
      users.id,
      users.username,
      users.full_name,
      users.location,
      users.latitude,
      users.longitude,
      users.categories,
      users.email,
      users.image,
      users.created_at
    FROM
      users
      INNER JOIN sessions ON (
        sessions.token = ${sessionToken}
        AND sessions.user_id = users.id
        AND expiry_timestamp > now()
      )
  `;
  return user;
});

export const updateUser = cache(
  async (
    sessionToken: string,
    updatedUser: Omit<User, 'categories' | 'createdAt'>,
  ) => {
    const [user] = await sql<User[]>`
      UPDATE users
      SET
        username = ${updatedUser.username.toLocaleLowerCase()},
        full_name = ${updatedUser.fullName},
        location = ${updatedUser.location},
        latitude = ${updatedUser.latitude},
        longitude = ${updatedUser.longitude},
        image = ${updatedUser.image},
        email = ${updatedUser.email}
      FROM
        sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND users.id = ${updatedUser.id}
      RETURNING
        users.id,
        users.username,
        users.full_name,
        users.location,
        users.latitude,
        users.longitude,
        users.categories,
        users.email,
        users.image,
        users.created_at
    `;

    return user;
  },
);

export const deleteUser = cache(async (sessionToken: string, id: number) => {
  const [user] = await sql<User[]>`
    DELETE FROM users USING sessions
    WHERE
      sessions.token = ${sessionToken}
      AND sessions.expiry_timestamp > now()
      AND sessions.user_id = users.id
      AND expiry_timestamp > now()
      AND users.id = ${id}
    RETURNING
      users.id,
      users.username,
      users.full_name,
      users.location,
      users.latitude,
      users.longitude,
      users.categories,
      users.email,
      users.image,
      users.created_at
  `;
  return user;
});

// public profile by username for logged users
export const getUserPublicByUsername = cache(
  async (sessionToken: string, username: string) => {
    const [user] = await sql<User[]>`
      SELECT
        users.id,
        users.username,
        users.full_name,
        users.location,
        users.latitude,
        users.longitude,
        users.categories,
        users.email,
        users.image,
        users.created_at
      FROM
        users
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND expiry_timestamp > now()
        )
      WHERE
        users.username = ${username}
    `;
    return user;
  },
);
// public profile by ID for logged users
export const getUserPublicById = cache(
  async (sessionToken: string, userId: number) => {
    const [user] = await sql<User[]>`
      SELECT
        users.id,
        users.username,
        users.full_name,
        users.location,
        users.latitude,
        users.longitude,
        users.categories,
        users.email,
        users.image,
        users.created_at
      FROM
        users
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND expiry_timestamp > now()
        )
      WHERE
        users.id = ${userId}
    `;
    return user;
  },
);

// public profile
export const getUserPublicByUsernameInsecure = cache(
  async (username: string) => {
    const [user] = await sql<Omit<User, 'fullName' | 'categories' | 'email'>[]>`
      SELECT
        users.id,
        users.username,
        users.location,
        users.latitude,
        users.longitude,
        users.image,
        users.created_at
      FROM
        users
      WHERE
        username = ${username.toLowerCase()}
    `;
    return user;
  },
);

// events organiser
export const getUserPublicByIdInsecure = cache(async (id: number) => {
  const [user] = await sql<Omit<User, 'fullName' | 'categories' | 'email'>[]>`
    SELECT
      users.id,
      users.username,
      users.location,
      users.latitude,
      users.longitude,
      users.image,
      users.created_at
    FROM
      users
    WHERE
      id = ${Number(id)}
  `;
  return user;
});

// login
export const getUserByUsernameInsecure = cache(async (username: string) => {
  const [user] = await sql<Pick<User, 'id' | 'username' | 'image'>[]>`
    SELECT
      users.id,
      users.username,
      users.image
    FROM
      users
    WHERE
      username = ${username.toLowerCase()}
  `;
  return user;
});

// login
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

// registration
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
          email,
          image
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
          ${newUser.email.toLowerCase()},
          ${newUser.image}
        )
      RETURNING
        users.id,
        users.username,
        users.full_name,
        users.location,
        users.latitude,
        users.longitude,
        users.categories,
        users.email,
        users.image
    `;
    return user;
  },
);

// login
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
