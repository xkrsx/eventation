'use client';

// TODO events as three different tabs: organising / attending / past
// shows only events that belong to logged user

import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Event } from '../../../database/events';
import ErrorMessage from '../../ErrorMessage';

type Props = {
  events: Event[];
};

export default function OrganisingEvents(props: Props) {
  const [eventId, setEventId] = useState(0);
  const [editedEvent, setEditedEvent] = useState({
    userId: 0,
    name: '',
    timeStart: '',
    timeEnd: '',
    category: '',
    location: '',
    latitude: '',
    longitude: '',
    price: '',
    description: '',
    links: '',
    images: '',
    public: true,
    cancelled: false,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setErrorMessage('');

    setEditedEvent({
      ...editedEvent,
      [event.target.name]: value,
    });
  }

  const events = props.events.map((event) => {
    return (
      <div key={`event-${event.id}`} style={{ border: '1px solid black' }}>
        <Link href={`/events/${event.id}`}>
          <h3>{event.name}</h3>
        </Link>
        <p>start: {dayjs(event.timeStart).format('dddd, HH:mm, DD/MM/YYYY')}</p>
        <p>end: {dayjs(event.timeEnd).format('dddd, HH:mm, DD/MM/YYYY')}</p>
        <p>price: {event.price}</p>
        <p>location: {event.location}</p>
        <p>category: {event.category}</p>
        <p>description: {event.description}</p>
        <Link href={`/events/${event.id}`}>See more...</Link>
        <p>
          <button
            onClick={() => {
              setEventId(event.id);
              setEditedEvent({
                ...editedEvent,
                userId: event.userId,
                name: event.name,
                timeStart: event.timeStart,
                timeEnd: event.timeStart,
                category: event.category,
                location: event.location,
                latitude: event.latitude,
                longitude: event.longitude,
                price: String(event.price),
                description: event.description,
                links: event.links,
                images: event.images,
                cancelled: event.cancelled,
              });
              // Default to an empty string to avoid
              // errors with passing null to input
              // values
            }}
          >
            Edit
          </button>
          <button
            onClick={async () => {
              const response = await fetch(`/api/events/${event.id}`, {
                method: 'DELETE',
              });

              setErrorMessage('');

              if (!response.ok) {
                let newErrorMessage = 'Error deleting the event';

                try {
                  const body = await response.json();
                  newErrorMessage = body.error;
                } catch {
                  // Don't fail if response JSON body
                  // cannot be parsed
                }

                // TODO: Use toast instead of showing
                // this below creation / update form
                setErrorMessage(newErrorMessage);
                return;
              }

              router.refresh();
            }}
          >
            Delete event
          </button>
        </p>
      </div>
    );
  });
  return (
    <div className="organising">
      <h2>Organising</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // TODO FIX api route
          const response = await fetch(`/api/events/${eventId}`, {
            method: 'PUT',
            body: JSON.stringify(editedEvent),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          setErrorMessage('');

          if (!response.ok) {
            let newErrorMessage = 'Error updating the event.';

            try {
              const body = await response.json();
              newErrorMessage = body.error;
            } catch (error) {
              console.log('err', error);
              // Don't fail if response JSON body cannot
              // be parsed
            }

            setErrorMessage(newErrorMessage);
            return;
          }

          router.refresh();
        }}
      >
        <label>
          Name
          <input name="name" value={editedEvent.name} onChange={handleChange} />
        </label>
        <label>
          Start time
          <input
            name="timeStart"
            value={editedEvent.timeStart}
            onChange={handleChange}
          />
        </label>
        <label>
          Category
          <input
            name="category"
            value={editedEvent.category}
            onChange={handleChange}
          />
        </label>
        <label>
          Location
          <input
            name="location"
            value={editedEvent.location}
            onChange={handleChange}
          />
        </label>
        <label>
          Latitude
          <input
            name="latitude"
            value={editedEvent.latitude}
            onChange={handleChange}
          />
        </label>
        <label>
          Longitude
          <input
            name="longitude"
            value={editedEvent.longitude}
            onChange={handleChange}
          />
        </label>
        <label>
          Price
          <input
            name="price"
            value={editedEvent.price}
            onChange={handleChange}
          />
        </label>
        <label>
          Description
          <input
            name="description"
            value={editedEvent.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Links
          <input
            name="links"
            value={editedEvent.links}
            onChange={handleChange}
          />
        </label>
        <label>
          Images
          <input
            name="images"
            value={editedEvent.images}
            onChange={handleChange}
          />
        </label>
        <button>Save Changes</button>
      </form>
      {events}
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </div>
  );
}
