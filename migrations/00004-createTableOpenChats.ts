import { Sql } from 'postgres';
import { z } from 'zod';

export const openchatMessageSchema = z.object({
  content: z.string(),
});

export type OpenChatMessage = {
  id: number;
  userId: number;
  eventId: number;
  content: string;
  timestamp: Date;
};

export type OpenChatMessageWithUsername = OpenChatMessage & {
  username: string;
};

export type OpenChatMessageWithUsernameAndReaction =
  OpenChatMessageWithUsername & {
    emoji: string | null;
  };

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE open_chats (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      event_id integer NOT NULL REFERENCES events (id) ON DELETE cascade,
      content text NOT NULL,
      timestamp timestamp NOT NULL DEFAULT now()
    );
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE open_chats`;
}
