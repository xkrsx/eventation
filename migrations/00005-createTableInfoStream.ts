import { Sql } from 'postgres';
import { z } from 'zod';

export const infoStreamMessageSchema = z.object({
  content: z.string(),
});

export type InfoStreamMessage = {
  id: number;
  userId: number;
  eventId: number;
  content: string;
  timestamp: Date;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE info_stream (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      event_id integer NOT NULL REFERENCES events (id) ON DELETE cascade,
      content text NOT NULL,
      timestamp timestamp NOT NULL DEFAULT now()
    );
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE info_stream`;
}
