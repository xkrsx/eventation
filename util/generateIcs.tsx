import dayjs from 'dayjs';
import { createEvent } from 'ics';
import { Event } from '../database/events';

export function generateIcs(event: Event) {
  const { error, value } = createEvent({
    start: [
      dayjs(event.timeStart).year(),
      dayjs(event.timeStart).month() + 1,
      dayjs(event.timeStart).date(),
      dayjs(event.timeStart).hour(),
      dayjs(event.timeStart).minute(),
    ],
    end: [
      dayjs(event.timeEnd).year(),
      dayjs(event.timeEnd).month() + 1,
      dayjs(event.timeEnd).date(),
      dayjs(event.timeEnd).hour(),
      dayjs(event.timeEnd).minute(),
    ],
    title: `NOT A REAL EVENT! ${event.name}`,
    description: `NOT A REAL EVENT! ${event.description}. Check url for my github.`,
    location: event.location,
    url: 'https://github.com/xkrsx',
    organizer: { name: 'organiser', email: 'example@example.com' },
  });

  if (error) {
    console.error('Error creating ICS file:', error);
    return null;
  }

  return value;
}
