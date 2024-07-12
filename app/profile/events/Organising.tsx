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
    cancelled: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const events = props.events.map((event) => {
    return (
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
            // TODO check what's id in animals dashboard
            disabled={id === event.id}
            onClick={() => {
              setEditedEvent({});
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
      {events}
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </div>
  );
}
