import { cache } from 'react';
import { sql } from './connect';

export type UsersEventsStatus = {
  userId: number;
  eventId: number;
  isOrganising: boolean;
  isAttending: string;
};

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
