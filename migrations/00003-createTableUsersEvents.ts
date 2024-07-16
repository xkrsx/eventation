import { Sql } from 'postgres';
import { z } from 'zod';

const isAttendingEnum = z.enum(['yes', 'maybe', 'no']);

export const usersEventsStatusSchema = z.object({
  userId: z.number(),
  eventId: z.number(),
  isOrganising: z.boolean(),
  isAttending: isAttendingEnum,
});

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE users_events (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      event_id integer NOT NULL REFERENCES events (id),
      is_organising boolean NOT NULL DEFAULT FALSE,
      is_attending varchar(5) NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE users_events `;
}
