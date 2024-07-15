import { Sql } from 'postgres';

export type Session = {
  id: number;
  token: string;
  userId: number;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE sessions (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      token varchar(150) NOT NULL UNIQUE,
      user_id integer NOT NULL REFERENCES users (user_id) ON DELETE cascade,
      expiry_timestamp timestamp NOT NULL DEFAULT now() + interval '24 hours'
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE sessions`;
}
