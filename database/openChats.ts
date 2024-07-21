import { cache } from 'react';
import {
  OpenChatMessage,
  OpenChatMessageWithUsernameAndReaction,
} from '../migrations/00004-createTableOpenChats';
import { sql } from './connect';

export const getOpenChatAllMessages = cache(
  async (sessionToken: string, eventId: number) => {
    const messages = await sql<OpenChatMessageWithUsernameAndReaction[]>`
      SELECT
        open_chats.*
      FROM
        open_chats
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND sessions.user_id = open_chats.user_id
          AND expiry_timestamp > now()
        )
      WHERE
        open_chats.event_id = ${eventId}
      ORDER BY
        open_chats.timestamp
    `;
    return messages;
  },
);

export const getOpenChatSingleMessage = cache(
  async (sessionToken: string, messageId: number) => {
    const [message] = await sql<OpenChatMessage[]>`
      SELECT
        open_chats.*
      FROM
        open_chats
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND sessions.user_id = open_chats.user_id
          AND expiry_timestamp > now()
        )
      WHERE
        open_chats.id = ${messageId}
      ORDER BY
        open_chats.timestamp
    `;
    return message;
  },
);

export const createOpenChatMessage = cache(
  async (sessionToken: string, eventId: number, content: string) => {
    const [message] = await sql<OpenChatMessageWithUsernameAndReaction[]>`
      WITH
        user_info AS (
          SELECT
            sessions.user_id,
            users.username
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
        open_chats.*,
        (
          SELECT
            username
          FROM
            user_info
        ) AS username,
        NULL AS emoji
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
