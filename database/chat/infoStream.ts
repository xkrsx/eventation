import { cache } from 'react';
import { InfoStreamMessage } from '../../migrations/00005-createTableInfoStream';
import { sql } from '../connect';

export const getInfoStreamLastHourMessages = cache(
  async (sessionToken: string, eventId: number) => {
    const messages = await sql<InfoStreamMessage[]>`
      SELECT
        info_stream.*
      FROM
        info_stream
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND expiry_timestamp > now()
        )
      WHERE
        info_stream.event_id = ${eventId}
        AND info_stream.timestamp >= now() - '1 hour'::interval
      ORDER BY
        info_stream.timestamp
    `;
    return messages;
  },
);

export const getInfoStreamLastDayMessages = cache(
  async (sessionToken: string, eventId: number) => {
    const messages = await sql<InfoStreamMessage[]>`
      SELECT
        info_stream.*
      FROM
        info_stream
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND expiry_timestamp > now()
        )
      WHERE
        info_stream.event_id = ${eventId}
        AND info_stream.timestamp >= now() - '24 hour'::interval
      ORDER BY
        info_stream.timestamp
    `;
    return messages;
  },
);

export const getInfoStreamAllMessages = cache(
  async (sessionToken: string, eventId: number) => {
    const messages = await sql<InfoStreamMessage[]>`
      SELECT
        info_stream.*
      FROM
        info_stream
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND expiry_timestamp > now()
        )
      WHERE
        info_stream.event_id = ${eventId}
      ORDER BY
        info_stream.timestamp
    `;
    return messages;
  },
);

export const createInfoStreamMessage = cache(
  async (
    sessionToken: string,
    eventId: number,
    username: string,
    content: string,
  ) => {
    const [message] = await sql<InfoStreamMessage[]>`
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
        info_stream (
          user_id,
          username,
          event_id,
          content
        )
      SELECT
        user_info.user_id,
        ${username},
        ${eventId},
        ${content}
      FROM
        user_info
      RETURNING
        info_stream.*
    `;
    return message;
  },
);

export const deleteInfoStreamMessage = cache(
  async (sessionToken: string, id: number) => {
    const [message] = await sql<InfoStreamMessage[]>`
      DELETE FROM info_stream USING sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND info_stream.id = ${id}
      RETURNING
        info_stream.*
    `;

    return message;
  },
);
