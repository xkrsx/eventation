import { cache } from 'react';
import { OpenChatMessage } from '../migrations/00004-createTableOpenChats';
import { sql } from './connect';

export const getOpenChatRecentMessages = cache(
  async (sessionToken: string, eventId: number) => {
    const messages = await sql<OpenChatMessage[]>`
      SELECT
        open_chats.*
      FROM
        open_chats
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND expiry_timestamp > now()
        )
      WHERE
        open_chats.event_id = ${eventId}
        AND open_chats.timestamp >= now() - '1 hour'::interval
      ORDER BY
        open_chats.timestamp
    `;
    return messages;
  },
);

export const createOpenChatMessage = cache(
  async (sessionToken: string, eventId: number, content: string) => {
    const [message] = await sql<OpenChatMessage[]>`
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
        open_chats (user_id, event_id, content)
      SELECT
        user_info.user_id,
        ${eventId},
        ${content}
      FROM
        user_info
      RETURNING
        open_chats.*
    `;
    return message;
  },
);

export const deleteMessage = cache(async (sessionToken: string, id: number) => {
  const [message] = await sql<OpenChatMessage[]>`
    DELETE FROM open_chats USING sessions
    WHERE
      sessions.token = ${sessionToken}
      AND sessions.expiry_timestamp > now()
      AND open_chats.id = ${id}
    RETURNING
      open_chats.*
  `;

  return message;
});
