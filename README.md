# EVENTATION

An app (website), where users can search, add or join events.
Any not logged user can search and browse events, but only registered and logged users can add or join them (attending, maybe and not attending).

### Planned basic functionalities:

- authentication
- authorization
- event full API (internal):
  - searching in the database
  - adding to the database
  - editing existing record in the database
  - deleting the record from database
- adding event image using cloudinary
- two types of chats for each event: open one for all users who joined the event (yes/maybe/no) and info channel, where only admin sends messages to all subscribed users (those who joined the event)

### Planned extra functionalities:

- event/organiser reviews
- calendar with events, second step: with export option to ICS and eventually: subscribing locally to the event calendar
- events map: using autocomplete from mapbox/google maps saving address, coding it into geolocation coordinates and pinning on the map

### Database schema:

- https://drawsql.app/teams/kryzys/diagrams/eventation

### Prototype:

- https://www.figma.com/proto/ZQrguGClsm5pVVCzW8JWfF?node-id=4-155&t=OdNGkZGJer0Pr7xB-6

### Technologies:

- html
- css
- javascript/node.js
- next.js
- react
- typescript

### External technologies:

- Ably
- Cloudinary
- Mapbox

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
