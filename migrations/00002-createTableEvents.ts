import { Sql } from 'postgres';
import { z } from 'zod';

export const eventSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Event name must have at least 3 characters.' })
    .max(255, { message: 'Event name must have maximum 255 characters.' }),
  userId: z.number(),
  // timeStart: z.date(),
  // timeEnd: z.date(),
  timeStart: z.string(),
  timeEnd: z.string(),
  category: z.string(),
  location: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  price: z.string().optional(),
  description: z
    .string()
    .min(3, {
      message: 'Event description must have at least 3 characters.',
    })
    .optional(),
  links: z.string().optional(),
  images: z.string().optional(),
  public: z.boolean().optional(),
  cancelled: z.boolean().optional(),
});
// TODO add optional short name to generate link with, instead of id
export async function up(sql: Sql) {
  await sql`
    CREATE TABLE events (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name varchar(255) NOT NULL,
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      time_start timestamp(0) WITHOUT TIME ZONE NOT NULL,
      time_end timestamp(0) WITHOUT TIME ZONE NOT NULL,
      category varchar NOT NULL,
      location varchar(255),
      latitude varchar(50),
      longitude varchar(50),
      price integer,
      description text,
      links text,
      images text,
      public boolean NOT NULL DEFAULT TRUE,
      cancelled boolean NOT NULL DEFAULT FALSE,
      created_at timestamp DEFAULT now() NOT NULL
    );
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE events`;
}
