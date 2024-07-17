import { cache } from 'react';
import { sql } from './connect';

export type UsersEventsStatus = {
  id: number;
  userId: number;
  eventId: number;
  isOrganising: boolean;
  isAttending: string;
};

export const checkStatus = cache(
  async (sessionToken: string, userId: number, eventId: number) => {
    const [checkedStatus] = await sql<UsersEventsStatus[]>`
      SELECT
        users_events.*
      FROM
        users_events
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND expiry_timestamp > now()
        )
      WHERE
        users_events.user_id = ${userId}
        AND users_events.event_id = ${eventId}
    `;
    return checkedStatus;
  },
);

export const addStatus = cache(
  async (
    sessionToken: string,
    userId: number,
    eventId: number,
    isOrganising: boolean,
    isAttending: string,
  ) => {
    const [addedStatus] = await sql<UsersEventsStatus[]>`
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
        users_events.*
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
    const [updatedStatus] = await sql<UsersEventsStatus[]>`
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
        AND users_events.user_id = ${userId}
        AND users_events.event_id = ${eventId}
      RETURNING
        users_events.*
    `;
    return updatedStatus;
  },
);
