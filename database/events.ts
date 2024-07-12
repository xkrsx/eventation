import { cache } from 'react';
import { sql } from './connect';

export type NewEvent = {
  name: string;
  userId: number;
  timeStart: Date;
  timeEnd: Date;
  category: string;
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  price: number | null;
  description: string | null;
  links: string | null;
  images: string | null;
};

export type Event = NewEvent & {
  id: number;
  createdAt: Date;
  public: boolean;
  cancelled: boolean;
};

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
            ${newEvent.timeStart},
            ${newEvent.timeEnd},
            ${newEvent.category},
            ${newEvent.location},
            ${newEvent.latitude},
            ${newEvent.longitude},
            ${newEvent.price},
            ${newEvent.description},
            ${newEvent.links},
            ${newEvent.images}
          FROM
            sessions
          WHERE
            token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
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
        events.images,
        events.created_at,
        events.public,
        events.cancelled
    `;
    return event;
  },
);

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
  `;
  return events;
});

export const getAllEventsInsecure = cache(async () => {
  const events = await sql<Event[]>`
    SELECT
      *
    FROM
      events
  `;
  return events;
});
