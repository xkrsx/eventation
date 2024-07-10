import { Sql } from 'postgres';
import { z } from 'zod';

const eventSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Event name must have at least 3 characters.' })
    .max(255, { message: 'Event name must have maximum 255 characters.' }),
  userId: z.number(),
  timeStart: z.date(),
  timeEnd: z.date(),
  category: z.string(),
  location: z.string().min(3).nullable(),
  latitude: z.string().min(6).nullable(),
  longitude: z.string().min(6).nullable(),
  price: z.number().nullable(),
  description: z
    .string()
    .min(3, {
      message: 'Event description must have at least 3 characters.',
    })
    .nullable(),
  links: z.string().nullable(),
  images: z.string().nullable(),
  public: z.boolean(),
  cancelled: z.boolean(),
});

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE events (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name varchar(255) NOT NULL,
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      time_start timestamp(0) WITHOUT TIME ZONE NOT NULL,
      time_end timestamp(0) WITHOUT TIME ZONE NOT NULL,
      category varchar NOT NULL,
      location varchar(255) NULL,
      latitude varchar(50) NULL,
      longitude varchar(50) NULL,
      price integer NULL,
      description text NULL,
      links text NULL,
      images text NULL,
      public boolean NOT NULL DEFAULT '1',
      cancelled boolean NOT NULL DEFAULT '0',
      created_at timestamp DEFAULT now() NOT NULL
    );
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE events`;
}
