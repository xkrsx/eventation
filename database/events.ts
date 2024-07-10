import { cache } from 'react';
import { sql } from './connect';

export type Event = {
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

export type NewEvent = Event & {
  id: number;
  createdAt: Date;
  public: boolean;
  cancelled: boolean;
};

export const createEvent = cache(
  async (sessionToken: string, newEvent: Event) => {
    const [event] = await sql<NewEvent[]>`
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
