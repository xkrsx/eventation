'use client';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from '@geoapify/react-geocoder-autocomplete';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { categoriesObject } from '../../../../database/categories';
import { Event } from '../../../../database/events';
import SingleEventLogged from '../../../common/SingleEvent/SingleEventLogged';
import ErrorMessage from '../../../ErrorMessage';

type Props = {
  event: Event;
};

export default function EditEventPreview(props: Props) {
  const [showForm, setShowForm] = useState(false);
  const [eventId, setEventId] = useState(0);
  const [editedEvent, setEditedEvent] = useState({
    userId: props.event.userId,
    name: props.event.name,
    timeStart: new Date(),
    timeEnd: new Date(),
    category: props.event.category,
    location: props.event.location,
    latitude: props.event.latitude,
    longitude: props.event.longitude,
    price: props.event.price,
    description: props.event.description,
    link: props.event.link,
    image: props.event.image,
    public: true,
    cancelled: false,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
  // TODO type req object
  function sendGeocoderRequest(value: string, geocoder: any) {
    return geocoder.sendGeocoderRequest(value);
  }

  // TODO type res object
  function sendPlaceDetailsRequest(feature: any, geocoder: any) {
    setEditedEvent({
      ...editedEvent,
      location: feature.properties.formatted,
      latitude: String(feature.properties.lat),
      longitude: String(feature.properties.lon),
    });
    return geocoder.sendPlaceDetailsRequest(feature);
  }

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
          <div className="location">
            <GeoapifyContext apiKey="4ca7dda985114a55bf51c15172c59328">
              <GeoapifyGeocoderAutocomplete
                // value="gorzów"
                placeholder="City"
                type="city"
                limit={3}
                allowNonVerifiedHouseNumber={true}
                sendGeocoderRequestFunc={sendGeocoderRequest}
                addDetails={true}
                sendPlaceDetailsRequestFunc={sendPlaceDetailsRequest}
              />
            </GeoapifyContext>
            Original location: {props.event.location}
          </div>
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
          <button className="button-confirm">Save changes</button>
          <button
            className="button-action"
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

      {props.event ? (
        <div style={{ border: '1px solid black' }}>
          <SingleEventLogged event={props.event} />
          <button
            className="button-action"
            onClick={() => {
              setShowForm(!showForm);
              setEventId(props.event.id);
              setEditedEvent({
                ...editedEvent,
                userId: props.event.userId,
                name: props.event.name,
                timeStart: new Date(props.event.timeStart),
                timeEnd: new Date(props.event.timeEnd),
                category: props.event.category,
                location: props.event.location,
                latitude: props.event.latitude,
                longitude: props.event.longitude,
                price: props.event.price,
                description: props.event.description,
                link: props.event.link,
                image: props.event.image,
                cancelled: props.event.cancelled,
              });
            }}
          >
            {showForm ? 'Cancel edit' : 'Edit event'}
          </button>
          <button
            className="button-delete"
            onClick={async () => {
              const response = await fetch(`/api/events/${props.event.id}`, {
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
      ) : (
        <div>
          <strong>Event not found.</strong>{' '}
          <Link href="/events/add">Add new event</Link>
        </div>
      )}
    </div>
  );
}
