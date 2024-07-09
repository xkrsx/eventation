import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE users (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      username varchar(30) NOT NULL UNIQUE,
      full_name varchar(100) NOT NULL,
      password_hash varchar(80) NOT NULL,
      location varchar(50),
      latitude varchar(50),
      longitude varchar(50),
      categories text,
      email varchar(80) NOT NULL UNIQUE,
      created_at timestamp DEFAULT now() NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE users`;
}
