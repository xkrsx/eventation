'use client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { categoriesObject } from '../../../database/categories';
import { Event } from '../../../database/events';
import SingleEventLogged from '../../common/SingleEvent/SingleEventLogged';
import ErrorMessage from '../../ErrorMessage';

type Props = {
  events: Event[];
};

export default function OrganisingEvents(props: Props) {
  const [showForm, setShowForm] = useState(false);
  const [eventId, setEventId] = useState(0);
  const [editedEvent, setEditedEvent] = useState({
    userId: 0,
    name: '',
    timeStart: new Date(),
    timeEnd: new Date(),
    category: '',
    location: '',
    latitude: '',
    longitude: '',
    price: 0,
    description: '',
    link: '',
    image: '',
    public: true,
    cancelled: false,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) {
    const value = event.target.value;

    setErrorMessage('');
    setEditedEvent({
      ...editedEvent,
      [event.target.name]: value,
    });
  }

  const categories = categoriesObject;

  const events = props.events.map((event) => {
    return (
      <div key={`event-${event.id}`} style={{ border: '1px solid black' }}>
        <SingleEventLogged event={event} />
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEventId(event.id);
            setEditedEvent({
              ...editedEvent,
              userId: event.userId,
              name: event.name,
              timeStart: new Date(event.timeStart),
              timeEnd: new Date(event.timeEnd),
              category: event.category,
              location: event.location,
              latitude: event.latitude,
              longitude: event.longitude,
              price: event.price,
              description: event.description,
              link: event.link,
              image: event.image,
              cancelled: event.cancelled,
            });
          }}
        >
          {showForm ? 'Cancel event' : 'Edit event'}
        </button>
        <button
          onClick={async () => {
            const response = await fetch(`/api/events/${event.id}`, {
              method: 'DELETE',
            });

            setErrorMessage('');

            if (!response.ok) {
              let newErrorMessage = 'Error deleting the event.';

              try {
                const body: { error: string } = await response.json();
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
      </div>
    );
  });
  return (
    <div className="organising">
      <h2>Organising</h2>
      {showForm ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
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
                const body: { error: string } = await response.json();

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
            setShowForm(false);
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
              type="datetime-local"
              name="timeStart"
              // value={editedEvent.timeStart}
              onChange={handleChange}
            />
          </label>
          <p>
            Original start time:{' '}
            {dayjs(editedEvent.timeStart).format('dddd, HH:mm, DD/MM/YYYY')}
          </p>
          <label>
            End time
            <input
              type="datetime-local"
              name="timeEnd"
              // value={editedEvent.timeEnd}
              onChange={handleChange}
            />
          </label>
          <p>
            Original end time:{' '}
            {dayjs(editedEvent.timeEnd).format('dddd, HH:mm, DD/MM/YYYY')}
          </p>
          <label>
            Category
            <select name="category" onChange={handleChange}>
              {categories.map((category) => {
                return (
                  <option
                    key={`option-key-${category.name}`}
                    value={category.name}
                  >
                    {category.name}
                  </option>
                );
              })}
            </select>
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
            Link
            <input
              name="link"
              value={editedEvent.link}
              onChange={handleChange}
            />
          </label>
          <button>Save changes</button>
          <button
            onClick={() => {
              setShowForm(!showForm);
            }}
          >
            Cancel edit
          </button>
        </form>
      ) : (
        ''
      )}
      <ErrorMessage>{errorMessage}</ErrorMessage>

      {events.length >= 1 ? (
        events
      ) : (
        <div>
          <strong>There are currently no events you are organising.</strong>{' '}
          <Link href="/events/add">Add new event</Link>
        </div>
      )}
    </div>
  );
}
