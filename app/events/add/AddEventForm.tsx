'use client';

// import {
//   GeoapifyContext,
//   GeoapifyGeocoderAutocomplete,
// } from '@geoapify/react-geocoder-autocomplete';
// import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { categoriesObject } from '../../../database/categories';
import { EventResponseBodyPost } from '../../api/events/route';
import ErrorMessage from '../../ErrorMessage';

type Props = {
  userId: number;
};

export default function AddEventForm(props: Props) {
  const [newEvent, setNewEvent] = useState({
    name: '',
    userId: props.userId,
    timeStart: undefined,
    timeEnd: undefined,
    category: 'Activism / Politics',
    location: undefined,
    latitude: undefined,
    longitude: undefined,
    price: 0,
    description: undefined,
    links: undefined,
    images: undefined,
  });
  // const [userLocation, setUserLocation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
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
    console.log('data: ', data);

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

  // Reset form states to default values so that the form is
  // cleared after an add, edit or delete action
  // function resetFormStates() {
  //   setId(0);
  //   setFirstName('');
  //   setType('');
  //   setAccessory('');
  //   setBirthDate(new Date());

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
          {/* TODO handle time/date saving */}
          {/* https://www.npmjs.com/package/react-datetime-picker */}
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
          {/* <input
                  type="date"
                  value={dayjs(birthDate).format('YYYY-MM-DD')}
                  onChange={(event) =>
                    setBirthDate(new Date(event.currentTarget.value))
                  }
                /> */}
          {/* <label>
            End time
            <input type="time" />
            <input type="date" />
          </label> */}
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
              value={newEvent.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Links
            <input
              name="links"
              value={newEvent.links}
              onChange={handleChange}
            />
          </label>
          <button>Add event</button>
        </form>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </div>
    </div>
  );
}
