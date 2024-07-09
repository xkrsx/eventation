import { cache } from 'react';
import { sql } from './connect';

export type Event = {
  id: number;
  name: string;
  userId: number;
  timeStart: Date;
  timeEnd: Date;
  category: string;
  location: string;
  price: number;
  description: string | null;
  links: string | null;
  images: string | null;
  public: boolean;
  cancelled: boolean;
  createdAt: Date;
};

export const createEvent = cache(
  async (sessionToken: string, newEvent: Event) => {
    const [event] = await sql<Omit<Event, 'id' | 'createdAt'>[]>`
      INSERT INTO
        events (
          name,
          user_id,
          time_start,
          time_end,
          category,
          location,
          price,
          description,
          links,
          images,
          public,
          cancelled
        ) (
          SELECT
            ${newEvent.name},
            ${newEvent.userId},
            ${newEvent.timeStart},
            ${newEvent.timeEnd},
            ${newEvent.category},
            ${newEvent.location},
            ${newEvent.price},
            ${newEvent.description},
            ${newEvent.links},
            ${newEvent.images},
            ${newEvent.public},
            ${newEvent.cancelled}
          FROM
            sessions
          WHERE
            token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      RETURNING
        events.name,
        events.user_id,
        events.time_start,
        events.time_end,
        events.category,
        events.location,
        events.price,
        events.description,
        events.links,
        events.images,
        events.public,
        events.cancelled
    `;
    return event;
  },
);
