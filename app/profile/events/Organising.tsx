'use client';

// TODO events as three different tabs: organising / attending / past
// shows only events that belong to logged user

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Event } from '../../../database/events';
import ErrorMessage from '../../ErrorMessage';

type Props = {
  events: Event[];
};

export default function OrganisingEvents(props: Props) {
  const [editedEvent, setEditedEvent] = useState({
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
    public: '',
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
      <div key={`event-id-${event.id}`}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            // TODO FIX api route
            const response = await fetch(`/api/events/${event.id}`, {
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
            <input
              name="name"
              value={editedEvent.name}
              onChange={handleChange}
            />
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
            End time
            <input
              name="timeEnd"
              value={editedEvent.timeEnd}
              onChange={handleChange}
            />
          </label>
          <button>Save Changes</button>
        </form>
        <div key={`event-${event.id}`} style={{ border: '1px solid black' }}>
          <Link href={`/events/${event.id}`}>
            <h3>{event.name}</h3>
          </Link>
          <p>{/* {event.timeStart} - {event.timeEnd} */}</p>
          <p>price: {event.price}</p>
          <p>location: {event.location}</p>
          <p>category: {event.category}</p>
          <p>description: {event.description}</p>
          <Link href={`/events/${event.id}`}>See more...</Link>
          <p>
            <button
              onClick={() => {
                setEditedEvent({
                  ...editedEvent,
                  name: event.name,
                  timeStart: event.timeStart,
                  timeEnd: event.timeStart,
                  category: event.category,
                  location: event.location,
                  latitude: event.latitude,
                  longitude: event.longitude,
                  price: event.price,
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
      </div>
    );
  });
  return (
    <div className="organising">
      <h2>Organising</h2>
      {events}
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </div>
  );
}
