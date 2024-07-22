import { cache } from 'react';
import { EventLoungeMessage } from '../../migrations/00004-createTableEventLounge';
import { sql } from '../connect';

export const getEvenLoungeRecentMessages = cache(
  async (sessionToken: string, eventId: number) => {
    const messages = await sql<EventLoungeMessage[]>`
      SELECT
        event_lounge.*
      FROM
        event_lounge
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND expiry_timestamp > now()
        )
      WHERE
        event_lounge.event_id = ${eventId}
        AND event_lounge.timestamp >= now() - '1 hour'::interval
      ORDER BY
        event_lounge.timestamp
    `;
    return messages;
  },
);

export const getEvenLoungeAllMessages = cache(
  async (sessionToken: string, eventId: number) => {
    const messages = await sql<EventLoungeMessage[]>`
      SELECT
        event_lounge.*
      FROM
        event_lounge
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND expiry_timestamp > now()
        )
      WHERE
        event_lounge.event_id = ${eventId}
      ORDER BY
        event_lounge.timestamp
    `;
    return messages;
  },
);

export const createEvenLoungeMessage = cache(
  async (sessionToken: string, eventId: number, content: string) => {
    const [message] = await sql<EventLoungeMessage[]>`
      WITH
        user_info AS (
          SELECT
            sessions.user_id
          FROM
            sessions
            INNER JOIN users ON (sessions.user_id = users.id)
          WHERE
            sessions.token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      INSERT INTO
        event_lounge (user_id, event_id, content)
      SELECT
        user_info.user_id,
        ${eventId},
        ${content}
      FROM
        user_info
      RETURNING
        event_lounge.*
    `;
    return message;
  },
);

export const deleteMessage = cache(async (sessionToken: string, id: number) => {
  const [message] = await sql<EventLoungeMessage[]>`
    DELETE FROM event_lounge USING sessions
    WHERE
      sessions.token = ${sessionToken}
      AND sessions.expiry_timestamp > now()
      AND event_lounge.id = ${id}
    RETURNING
      event_lounge.*
  `;

  return message;
});
