'use client';

// import {
//   GeoapifyContext,
//   GeoapifyGeocoderAutocomplete,
// } from '@geoapify/react-geocoder-autocomplete';

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
    category: 'Activism / Politics',
    location: '',
    latitude: '',
    longitude: '',
    price: 0,
    description: '',
    links: '',
    images: '',
  });
  // const [userLocation, setUserLocation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  console.log('newEvent.images: ', newEvent.images);

  const router = useRouter();

  function addImageUrl(url: string) {
    setNewEvent({ ...newEvent, images: url });
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    checkForm();
    event.preventDefault();

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
  // TODO type req object
  // function sendGeocoderRequest(value: string, geocoder: any) {
  //   return geocoder.sendGeocoderRequest(value);
  // }

  // TODO type res object
  // function sendPlaceDetailsRequest(feature: any, geocoder: any) {
  //   setNewEvent({
  //     ...newEvent,
  //     location: feature.properties.formatted,
  //     latitude: String(feature.properties.lat),
  //     longitude: String(feature.properties.lon),
  //   });
  //   return geocoder.sendPlaceDetailsRequest(feature);
  // }

  function checkForm() {
    if (newEvent.name.length < 3) {
      setErrorMessage('Event name must have at least 3 characters.');
      // setIsDisabled(true);
    }
    if (newEvent.name.length >= 255) {
      setErrorMessage('Event name must have maximum 255 characters.');
      // setIsDisabled(true);
    }
    if (
      newEvent.timeEnd <= newEvent.timeStart &&
      (newEvent.timeStart || newEvent.timeEnd === '')
    ) {
      setErrorMessage('Starting date/time must be earlier than ending.');
      // setIsDisabled(true);
    }

    if (newEvent.description.length < 3) {
      setErrorMessage('Event description must have at least 3 characters.');
      // setIsDisabled(true);
    }
    if (!validator.isURL(newEvent.links)) {
      setErrorMessage('Link must valid URL.');
      // setIsDisabled(true);
    }
    if (
      newEvent.name.length >= 3 &&
      newEvent.name.length <= 255 &&
      newEvent.timeEnd >= newEvent.timeStart &&
      (newEvent.timeStart || newEvent.timeEnd !== '') &&
      validator.isURL(newEvent.links)
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
      <div className="event">
        <h1>Add event</h1>
        {/* add picture upload */}
        {/* fix time editing */}
        {/* fix location */}
        {/* fix category */}

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
              value={newEvent.price}
              onChange={handleChange}
            />
            ,-
          </label>

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
          {/* <div className="location">
            <label>
              <label>
                <input
                  type="radio"
                  value="City"
                  name="type"
                  disabled={!userLocation}
                />
                City
              </label>
              <GeoapifyContext apiKey="00a9862ac01f454887fc285e220d8460">
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
                <input
                  type="radio"
                  value="Country"
                  name="type"
                  disabled={!userLocation}
                />
                Country
              </label>
              <GeoapifyContext apiKey="00a9862ac01f454887fc285e220d8460">
                <GeoapifyGeocoderAutocomplete
                  placeholder="Country"
                  type="country"
                  limit={3}
                  allowNonVerifiedHouseNumber={true}
                  sendGeocoderRequestFunc={sendGeocoderRequest}
                  addDetails={true}
                  sendPlaceDetailsRequestFunc={sendPlaceDetailsRequest}
                />
              </GeoapifyContext>
            </label>
          </div> */}
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
            <input
              name="links"
              value={newEvent.links}
              onChange={handleChange}
            />
          </label>
          <ImageUpload
            buttonText="Upload an event poster"
            options={{
              sources: ['local', 'url'],
            }}
            alt={newEvent.name}
            addUrlOnUpload={addImageUrl}
          />

          <button disabled={isDisabled}>Add event</button>
        </form>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </div>
    </div>
  );
}
