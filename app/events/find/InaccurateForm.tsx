'use client';

import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from '@geoapify/react-geocoder-autocomplete';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { categoriesObject } from '../../../database/categories';
import { EventResponseBodyPost } from '../../api/events/route';
import ErrorMessage from '../../ErrorMessage';

export default function FindEventInaccurateForm() {
  const [searchedEvent, setSearchedEvent] = useState({
    name: '',
    userId: '',
    category: 'Activism / Politics',
    location: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const router = useRouter();

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    checkForm();
    event.preventDefault();

    const response = await fetch('/api/events/findInaccurate', {
      method: 'GET',
      body: JSON.stringify(searchedEvent),
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
    setSearchedEvent({
      ...searchedEvent,
      location: feature.properties.formatted,
    });
    return geocoder.sendPlaceDetailsRequest(feature);
  }

  function checkForm() {
    if (searchedEvent.name.length < 3) {
      setErrorMessage('Event name must have at least 3 characters.');
    }
    if (searchedEvent.name.length >= 255) {
      setErrorMessage('Event name must have maximum 255 characters.');
    }
    if (searchedEvent.name.length >= 3 && searchedEvent.name.length <= 255) {
      setIsDisabled(false);
    }
  }

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
          <label>
            Name
            <input
              name="name"
              value={searchedEvent.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Organiser
            <input
              name="userId"
              value={searchedEvent.name}
              onChange={handleChange}
            />
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

          <button disabled={isDisabled}>Find event</button>
        </form>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </div>
    </div>
  );
}
