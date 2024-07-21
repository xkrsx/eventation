import { cache } from 'react';
import { OpenChatReaction } from '../migrations/00005-createTableOpenChatReactions';
import { sql } from './connect';

export const getOpenChatAllReactions = cache(
  async (sessionToken: string, messageId: number) => {
    const reactions = await sql<OpenChatReaction[]>`
      SELECT
        open_chat_reactions.*
      FROM
        open_chat_reactions
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND sessions.user_id = open_chat_reactions.user_id
          AND expiry_timestamp > now()
        )
      WHERE
        open_chat_reactions.message_id = ${messageId}
    `;
    return reactions;
  },
);

export const getOpenChatSingleReaction = cache(
  async (sessionToken: string, reactionId: number) => {
    const [reaction] = await sql<OpenChatReaction[]>`
      SELECT
        open_chat_reactions.*
      FROM
        open_chat_reactions
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND sessions.user_id = open_chat_reactions.user_id
          AND expiry_timestamp > now()
        )
      WHERE
        open_chat_reactions.id = ${reactionId}
    `;
    return reaction;
  },
);

export const getOpenChatAllReactionsInsecure = cache(
  async (messageId: number) => {
    const reactions = await sql<OpenChatReaction[]>`
      SELECT
        open_chat_reactions.*
      FROM
        open_chat_reactions
      WHERE
        open_chat_reactions.message_id = ${messageId}
    `;
    return reactions;
  },
);

export const createOpenChatReaction = cache(
  async (sessionToken: string, messageId: number, emoji: string) => {
    const [reaction] = await sql<OpenChatReaction[]>`
      INSERT INTO
        open_chat_reactions (user_id, message_id, emoji) (
          SELECT
            user_id,
            ${messageId},
            ${emoji}
          FROM
            sessions
          WHERE
            token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      RETURNING
        open_chat_reactions.*
    `;
    return reaction;
  },
);

export const updateReaction = cache(
  async (sessionToken: string, updatedReaction: OpenChatReaction) => {
    const [reaction] = await sql<OpenChatReaction[]>`
      UPDATE open_chat_reactions
      SET
        user_id = ${updatedReaction.userId},
        message_id = ${updatedReaction.messageId},
        emoji = ${updatedReaction.emoji}
      FROM
        sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND open_chat_reactions.id = ${updatedReaction.id}
      RETURNING
        open_chat_reactions.*
    `;
    return reaction;
  },
);

export const deleteReaction = cache(
  async (sessionToken: string, id: number) => {
    const [reaction] = await sql<OpenChatReaction[]>`
      DELETE FROM open_chat_reactions USING sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND open_chat_reactions.id = ${id}
      RETURNING
        open_chat_reactions.*
    `;

    return reaction;
  },
);
