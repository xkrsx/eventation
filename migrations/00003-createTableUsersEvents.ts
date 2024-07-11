import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE users_events (
      user_id integer NOT NULL,
      event_id integer NOT NULL,
      is_organising boolean NOT NULL DEFAULT FALSE,
      is_attending varchar(5) NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE users_events `;
}
