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
  price: string;
  description: string;
  links: string;
  images: string;
};

export type Event = NewEvent & {
  eventId: number;
  createdAt: Date;
  public: boolean;
  cancelled: boolean;
};

export type JoinedEvent = Event & {};

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
        events.event_id,
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

export const getSingleEventInsecure = cache(async (eventId: number) => {
  const [event] = await sql<Event[]>`
    SELECT
      events.*
    FROM
      events
    WHERE
      events.event_id = ${eventId}
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
  `;
  return events;
});

export const updateEvent = cache(
  async (sessionToken: string, updatedEvent: Event) => {
    const [event] = await sql<Event[]>`
      UPDATE events
      SET
        name = ${updatedEvent.name},
        user_id = ${updatedEvent.userId},
        time_start = ${updatedEvent.timeStart},
        time_end = ${updatedEvent.timeEnd},
        category = ${updatedEvent.category},
        location = ${updatedEvent.location},
        latitude = ${updatedEvent.latitude},
        longitude = ${updatedEvent.longitude},
        price = ${updatedEvent.price},
        description = ${updatedEvent.description},
        links = ${updatedEvent.links},
        images = ${updatedEvent.images},
        public = ${updatedEvent.public},
        cancelled = ${updatedEvent.cancelled}
      FROM
        sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND events.event_id = ${updatedEvent.eventId}
      RETURNING
        events.*
    `;
    return event;
  },
);

export const deleteUsersEventOrganising = cache(
  async (sessionToken: string, eventId: number) => {
    const [event] = await sql<Event[]>`
      DELETE FROM events USING sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND sessions.user_id = events.user_id
        AND expiry_timestamp > now()
        AND events.event_id = ${eventId}
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
