# EVENTATION

An app (website), where users can search, add or join events.
Any not logged user can search and browse events, but only registered and logged users can add or join them (attending, maybe and not attending).
Events contain location (autocompletion with geocoordinates), category (out of available list), image uploaded by organiser and chat (two channels).
Every event has two chat channels: open for every attendant to participate with other and second where organiser can message all attendants.

### Planned basic functionalities:

- authentication
- authorization
- event full API (internal):
  - searching in the database
  - adding to the database
  - editing existing record in the database
  - deleting the record from database
  - user's attendance to the event (saving, editing in the database)
  - saving and editing cloudinary uploaded image url in the database
- users full API (internal):
  - searching in the database
  - adding to the database
  - editing existing record in the database
  - deleting the record from database
  - saving and editing cloudinary uploaded image url in the database
- chat API (internal):
  - saving and getting messages from internal database
- autocomplete of addresses when creating new user and event
- adding event image using cloudinary
- adding user profile image using cloudinary
- two types of chats for each event: open one for all users who joined the event (yes/maybe/no) and info channel, where only admin sends messages to all subscribed users (those who joined the event)

### Planned extra functionalities:

- event/organiser reviews by attendants;
- calendar feature: event export to ICS file for user to download locally; calendar with all/users events; subscribing locally to the event calendar;
- map feature: showing all and approximate locations and events on map based on autocomplete function

### Database schema:

- https://drawsql.app/teams/kryzys/diagrams/eventation

### Prototype:

- https://www.figma.com/proto/ZQrguGClsm5pVVCzW8JWfF?node-id=4-155&t=OdNGkZGJer0Pr7xB-6

### Technologies:

- Next.js
- Postgres.js
- Javascript/Node.js
- Typescript
- React
- Material UI
- HTML
- CSS
- Jest
- Playwright

### External technologies:

- Pusher (real-time features API)
- Cloudinary (upload image and its link generator API)
- Geoapify (autocomplete)

## Database Setup

If you don't have PostgreSQL installed yet, follow the instructions from the PostgreSQL step in [UpLeveled's System Setup Instructions](https://github.com/upleveled/system-setup/blob/master/readme.md).

Copy the `.env.example` file to a new file called `.env` (ignored from Git) and fill in the necessary information.

Then, connect to the built-in `postgres` database as administrator in order to create the database:

**Windows**

If it asks for a password, use `postgres`.

```bash
psql -U postgres
```

**macOS**

```bash
psql postgres
```

**Linux**

```bash
sudo -u postgres psql
```

Once you have connected, run the following to create the database:

```sql
CREATE DATABASE <database name>;
CREATE USER <user name> WITH ENCRYPTED PASSWORD '<user password>';
GRANT ALL PRIVILEGES ON DATABASE <database name> TO <user name>;
\connect <database name>
CREATE SCHEMA <schema name> AUTHORIZATION <user name>;
```

Quit `psql` using the following command:

```bash
\q
```

On Linux, it is [best practice to create an operating system user for each database](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_and_using_database_servers/using-postgresql_configuring-and-using-database-servers#con_postgresql-users_using-postgresql), to ensure that the operating system user can only access the single database and no other system resources. A different password is needed on Linux because [passwords of operating system users cannot contain the user name](https://github.com/upleveled/system-setup/issues/74). First, generate a random password and copy it:

```bash
openssl rand -hex 16
```

Then create the user, using the database user name from the previous section above. When you are prompted to create a password for the user, paste in the generated password.

```bash
sudo adduser <user name>
```

Once you're ready to use the new user, reconnect using the following command.

**Windows and macOS:**

```bash
psql -U <user name> <database name>
```

**Linux:**

```bash
sudo -u <user name> psql -U <user name> <database name>
```

## Run Tests

To run unit tests with Jest, use the following command:

```bash
pnpm jest
```

To run end-to-end tests with Playwright, use the following command:

```bash
pnpm playwright test
```

## Deployment

- Fly.io
- Docker

## Authentication

Some pages are protected with sessions and can only be accessed by authenticated users. User needs to login with username and password to be authenticated. Authenticated users can access the protected pages and perform CRUD operations on the events and change attendance to them.

```
export type User = {
  id: number;
  username: string;
  fullName: string;
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  categories: string | null;
  email: string;
  image: string;
  createdAt: Date;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

type Error = {
  message: string;
};

```

```
- /api/(auth)/register
  - POST   => User   | Error[]   (create user)

- /api/(auth)/login
  - POST   => User   | Error[]   (login user)
```
