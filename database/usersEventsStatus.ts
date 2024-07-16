import { cache } from 'react';
import { sql } from './connect';

export type UsersEventsStatus = {
  id: number;
  userId: number;
  eventId: number;
  isOrganising: boolean;
  isAttending: string;
};

export const checkStatusInsecure = cache(
  async (userId: number, eventId: number) => {
    const [checkedStatus] = await sql<UsersEventsStatus[]>`
      SELECT
        users_events.*
      FROM
        users_events
      WHERE
        user_id = ${userId}
        AND event_id = ${eventId}
    `;
    return checkedStatus;
  },
);
// export const checkStatus = cache(
//   async (session, eventId: number) => {
//     const [checkedStatus] = await sql<UsersEventsStatus[]>`
//       SELECT
//         users_events.*
//       FROM
//         users_events
//         INNER JOIN sessions ON (
//           sessions.token = ${session.}
//           AND expiry_timestamp > now()
//           AND users_events.user_id = ${userId}
//           AND users_events.event_id = ${eventId}
//         )
//     `;
//     return checkedStatus;
//   },
// );

export const addStatus = cache(
  async (
    sessionToken: string,
    userId: number,
    eventId: number,
    isOrganising: boolean,
    isAttending: string,
  ) => {
    const [addedStatus] = await sql<Omit<UsersEventsStatus, 'id'>[]>`
      INSERT INTO
        users_events (
          user_id,
          event_id,
          is_organising,
          is_attending
        ) (
          SELECT
            ${userId},
            ${eventId},
            ${isOrganising},
            ${isAttending}
          FROM
            sessions
          WHERE
            token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      RETURNING
        users_events.user_id,
        users_events.event_id,
        users_events.is_organising,
        users_events.is_attending
    `;
    return addedStatus;
  },
);

export const updateStatus = cache(
  async (
    sessionToken: string,
    userId: number,
    eventId: number,
    isOrganising: boolean,
    isAttending: string,
  ) => {
    const [updatedStatus] = await sql<Omit<UsersEventsStatus, 'id'>[]>`
      UPDATE users_events
      SET
        user_id = ${userId},
        event_id = ${eventId},
        is_organising = ${isOrganising},
        is_attending = ${isAttending}
      FROM
        sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
      RETURNING
        users_events.user_id,
        users_events.event_id,
        users_events.is_organising,
        users_events.is_attending
    `;
    return updatedStatus;
  },
);
