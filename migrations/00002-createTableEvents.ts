import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE events (
      id integer NOT NULL,
      name varchar(255) NOT NULL,
      user_id integer NOT NULL,
      time_start timestamp(0) WITHOUT TIME ZONE NOT NULL,
      time_end timestamp(0) WITHOUT TIME ZONE NOT NULL,
      category varchar NOT NULL,
      location varchar(255) NOT NULL,
      price integer NOT NULL,
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
