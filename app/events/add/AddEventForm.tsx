'use client';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import './AddEventForm.scss';
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from '@geoapify/react-geocoder-autocomplete';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import validator from 'validator';
import { categoriesObject } from '../../../database/categories';
import { EventResponseBodyPost } from '../../api/events/route';
import ImageUpload from '../../common/ImageUpload/ImageUpload';
import ErrorMessage from '../../ErrorMessage';

type Props = {
  userId: number;
};

export default function AddEventForm(props: Props) {
  const [newEvent, setNewEvent] = useState({
    name: '',
    userId: props.userId,
    timeStart: '',
    timeEnd: '',
    category: '',
    location: '',
    latitude: '',
    longitude: '',
    price: 0,
    description: '',
    link: '',
    image: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const router = useRouter();

  function addImageUrl(url: string) {
    setNewEvent({ ...newEvent, image: url });
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    checkForm();

    // TODO add session token to validate if it's really same user?
    const response = await fetch('/api/events/', {
      method: 'POST',
      body: JSON.stringify(newEvent),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data: EventResponseBodyPost = await response.json();

    if ('errors' in data) {
      setErrorMessage(String(data.errors));
      return;
    }
    if ('event' in data) {
      router.push(`/events/${data.event.id}`);
    }
  }

  function sendGeocoderRequest(value: string, geocoder: any) {
    return geocoder.sendGeocoderRequest(value);
  }

  function sendPlaceDetailsRequest(feature: any, geocoder: any) {
    setNewEvent({
      ...newEvent,
      location: feature.properties.formatted,
      latitude: String(feature.properties.lat),
      longitude: String(feature.properties.lon),
    });
    return geocoder.sendPlaceDetailsRequest(feature);
  }

  function checkForm() {
    if (newEvent.name.length < 3) {
      setErrorMessage('Event name must have at least 3 characters.');
    }
    if (newEvent.name.length >= 255) {
      setErrorMessage('Event name must have maximum 255 characters.');
    }
    if (
      newEvent.timeEnd <= newEvent.timeStart &&
      (newEvent.timeStart || newEvent.timeEnd === '')
    ) {
      setErrorMessage('Starting date/time must be earlier than ending.');
    }
    if (newEvent.description.length < 3) {
      setErrorMessage('Event description must have at least 3 characters.');
    }
    if (!validator.isURL(newEvent.link)) {
      setErrorMessage('Link must valid URL.');
    }
    if (newEvent.image === '') {
      setErrorMessage('Please add event image');
    }
    if (
      newEvent.name.length >= 3 &&
      newEvent.name.length <= 255 &&
      newEvent.timeEnd >= newEvent.timeStart &&
      (newEvent.timeStart || newEvent.timeEnd !== '') &&
      validator.isURL(newEvent.link)
    ) {
      setIsDisabled(false);
    }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) {
    const value = event.target.value;

    setErrorMessage('');
    setNewEvent({
      ...newEvent,
      [event.target.name]: value,
    });
  }

  const categories = categoriesObject;

  return (
    <div className="wrapper">
      <h1>Add event</h1>
      <div className="add-event">
        <div className="image-upload">
          <ImageUpload
            buttonText="Upload event image"
            options={{
              sources: ['local', 'url', 'google_drive'],
            }}
            alt={newEvent.name}
            addUrlOnUpload={addImageUrl}
            uploadType="event"
          />
        </div>
        <form
          className="form"
          onSubmit={async (event) => {
            // eslint error: no preventDefault() even though there is one in called function
            event.preventDefault();
            await handleCreate(event);
          }}
        >
          <label>
            Name
            <input
              required
              name="name"
              value={newEvent.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Start time
            <input
              aria-label="Date and time"
              type="datetime-local"
              required
              name="timeStart"
              value={newEvent.timeStart}
              onChange={handleChange}
            />
          </label>
          <label>
            End time
            <input
              aria-label="Date and time"
              type="datetime-local"
              required
              name="timeEnd"
              value={newEvent.timeEnd}
              onChange={handleChange}
            />
          </label>
          <label>
            Price €{' '}
            <input
              type="number"
              name="price"
              value={Number(newEvent.price)}
              onChange={handleChange}
            />
          </label>
          <label>
            Category
            <select name="category" onChange={handleChange}>
              <option defaultValue="true" hidden disabled />

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

          <GeoapifyContext
            apiKey="4ca7dda985114a55bf51c15172c59328"
            // apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}
          >
            <GeoapifyGeocoderAutocomplete
              placeholder="City"
              type="city"
              limit={3}
              allowNonVerifiedHouseNumber={true}
              sendGeocoderRequestFunc={sendGeocoderRequest}
              addDetails={true}
              sendPlaceDetailsRequestFunc={sendPlaceDetailsRequest}
            />
          </GeoapifyContext>
          <label>
            Description
            <input
              name="description"
              required
              value={newEvent.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Link
            <input name="link" value={newEvent.link} onChange={handleChange} />
          </label>
          <button className="button-confirm" disabled={isDisabled}>
            Add event
          </button>
        </form>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </div>
    </div>
  );
}
