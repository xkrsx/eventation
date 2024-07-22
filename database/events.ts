import { cache } from 'react';
import { sql } from './connect';

export type NewEvent = {
  name: string;
  userId: number;
  timeStart: Date;
  timeEnd: Date;
  category: string;
  location: string;
  latitude: string;
  longitude: string;
  price: number;
  description: string;
  links: string;
  images: string;
};

export type UpdatedEvent = NewEvent & {
  id: number;
};

export type Event = NewEvent & {
  id: number;
  createdAt: Date;
  public: boolean;
  cancelled: boolean;
};

// // TODO can you interpolate
// export const findSingleEventInsecure = cache(
//   async (formQuery: string, userQuery: string) => {
//     const [event] = await sql<Event[]>`
//       SELECT
//         events.*
//       FROM
//         events
//       WHERE
//         events.${formQuery} = ${userQuery}
//     `;
//     return event;
//   },
// );

export const createEvent = cache(
  async (sessionToken: string, newEvent: NewEvent) => {
    const [event] = await sql<Event[]>`
      INSERT INTO
        events (
          name,
          user_id,
          time_start,
          time_end,
          category,
          location,
          latitude,
          longitude,
          price,
          description,
          links,
          images
        ) (
          SELECT
            ${newEvent.name},
            ${newEvent.userId},
            ${new Date(newEvent.timeStart)},
            ${new Date(newEvent.timeEnd)},
            ${newEvent.category},
            ${String(newEvent.location)},
            ${String(newEvent.latitude)},
            ${String(newEvent.longitude)},
            ${Number(newEvent.price)},
            ${String(newEvent.description)},
            ${String(newEvent.links)},
            ${String(newEvent.images)}
          FROM
            sessions
          WHERE
            token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      RETURNING
        events.*
    `;
    return event;
  },
);

export const getSingleEventInsecure = cache(async (id: number) => {
  const [event] = await sql<Event[]>`
    SELECT
      events.*
    FROM
      events
    WHERE
      events.id = ${id}
  `;
  return event;
});

export const getUsersEventsOrganising = cache(async (sessionToken: string) => {
  const events = await sql<Event[]>`
    SELECT
      events.*
    FROM
      events
      INNER JOIN sessions ON (
        sessions.token = ${sessionToken}
        AND sessions.user_id = events.user_id
        AND expiry_timestamp > now()
      )
    WHERE
      (time_start >= now())
      OR (time_end >= now())
  `;
  return events;
});

export const getUsersEventsAttending = cache(
  async (sessionToken: string, userId: number) => {
    const events = await sql<Event[]>`
      SELECT
        events.*
      FROM
        events
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND expiry_timestamp > now()
        )
        INNER JOIN users_events ON (
          events.id = users_events.event_id
          AND users_events.user_id = ${userId}
        )
      WHERE
        (time_start >= now())
        OR (time_end >= now())
    `;
    return events;
  },
);
export const getUsersEventsPast = cache(
  async (sessionToken: string, userId: number) => {
    const events = await sql<Event[]>`
      SELECT
        events.*
      FROM
        events
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND expiry_timestamp > now()
        )
        INNER JOIN users_events ON (
          events.id = users_events.event_id
          AND users_events.user_id = ${userId}
        )
      WHERE
        (time_start < now())
        AND (time_end < now())
    `;
    return events;
  },
);

export const updateEvent = cache(
  async (sessionToken: string, updatedEvent: UpdatedEvent) => {
    const [event] = await sql<UpdatedEvent[]>`
      UPDATE events
      SET
        name = ${updatedEvent.name},
        user_id = ${updatedEvent.userId},
        time_start = ${updatedEvent.timeStart},
        time_end = ${updatedEvent.timeEnd},
        category = ${updatedEvent.category},
        location = ${String(updatedEvent.location)},
        latitude = ${String(updatedEvent.latitude)},
        longitude = ${String(updatedEvent.longitude)},
        price = ${Number(updatedEvent.price)},
        description = ${String(updatedEvent.description)},
        links = ${String(updatedEvent.links)},
        images = ${String(updatedEvent.images)}
      FROM
        sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND events.id = ${updatedEvent.id}
      RETURNING
        events.id,
        events.name,
        events.user_id,
        events.time_start,
        events.time_end,
        events.category,
        events.location,
        events.latitude,
        events.longitude,
        events.price,
        events.description,
        events.links,
        events.images
    `;

    return event;
  },
);

export const deleteUsersEventOrganising = cache(
  async (sessionToken: string, id: number) => {
    const [event] = await sql<Event[]>`
      DELETE FROM events USING sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND sessions.user_id = events.user_id
        AND expiry_timestamp > now()
        AND events.id = ${id}
      RETURNING
        events.*
    `;
    return event;
  },
);

export const getAllEventsSortDateInsecure = cache(async () => {
  const events = await sql<Event[]>`
    SELECT
      *
    FROM
      events
    ORDER BY
      events.time_start
  `;
  return events;
});

export const getAllEventsSortPriceInsecure = cache(async () => {
  const events = await sql<Event[]>`
    SELECT
      *
    FROM
      events
    ORDER BY
      events.price
  `;
  return events;
});
