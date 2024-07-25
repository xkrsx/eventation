'use client';

import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from '@geoapify/react-geocoder-autocomplete';
import { ChangeEvent, useState } from 'react';
import { categoriesObject } from '../../../database/categories';
import { EventResponseBodyPost } from '../../api/events/route';
import ErrorMessage from '../../ErrorMessage';

export default function FindEventInaccurateForm() {
  const [searchedEvent, setSearchedEvent] = useState({
    name: '',
    username: '',
    category: '',
    location: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>([]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) {
    const value = event.target.value;
    setErrorMessage('');
    setSearchedEvent({
      ...searchedEvent,
      [event.target.name]: value,
    });
  }

  const categories = categoriesObject;

  function sendGeocoderRequest(value: string, geocoder: any) {
    return geocoder.sendGeocoderRequest(value);
  }

  function sendPlaceDetailsRequest(feature: any, geocoder: any) {
    setSearchedEvent({
      ...searchedEvent,
      location: feature.properties.formatted,
    });
    return geocoder.sendPlaceDetailsRequest(feature);
  }

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch('/api/events/findInaccurate', {
      method: 'POST',
      body: JSON.stringify(searchedEvent),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data: EventResponseBodyPost = await response.json();

    if ('errors' in data) {
      return setErrorMessage('');
    }
    // TODO show results
    if ('event' in data) {
    }
  }

  return (
    <div className="wrapper">
      <div className="event">
        <form
          className="form"
          onSubmit={async (event) => {
            // eslint error: no preventDefault() even though there is one in called function
            event.preventDefault();
            await handleSearch(event);
          }}
        >
          <label htmlFor="name">
            Name
            <input
              name="name"
              value={searchedEvent.name}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="organiser">
            Organiser
            <input
              name="username"
              value={searchedEvent.username}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="category">
            Category
            <select name="category" defaultChecked onChange={handleChange}>
              <option defaultValue="true" />
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
          <label htmlFor="location">
            Location
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
          </label>
          <button>Find matching events</button>
        </form>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </div>
    </div>
  );
}
