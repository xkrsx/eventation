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

export default function FindEventAccurateForm() {
  const [searchedField, setSearchedField] = useState('');
  const [searchedEvent, setSearchedEvent] = useState({
    name: '',
    userId: '',
    category: 'Activism / Politics',
    location: '',
  });
  console.log('searchedField: ', searchedField);
  console.log('searchedEvent: ', searchedEvent);

  const [errorMessage, setErrorMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const handleRadioChange = (value: string) => {
    setSearchedField(value);
  };

  const router = useRouter();

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

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) {
    const value = event.target.value;

    setErrorMessage('');
    setSearchedField(event.target.name);
    setSearchedEvent({
      ...searchedEvent,
      [event.target.name]: value,
    });
  }

  const categories = categoriesObject;

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

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    checkForm();

    const response = await fetch('/api/events/findAccurate', {
      method: 'GET',
      body: JSON.stringify({ field: searchedField, event: searchedEvent }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data: EventResponseBodyPost = await response.json();

    if ('errors' in data) {
      setErrorMessage(String(data.errors));
      return;
    }
    // TODO show results
    if ('event' in data) {
      router.push(`/events/${data.event.id}`);
    }
  }

  return (
    <div className="wrapper">
      <div className="event">
        Choose one option to find exact match
        <form
          className="form"
          onSubmit={async (event) => {
            // eslint error: no preventDefault() even though there is one in called function
            event.preventDefault();
            await handleSearch(event);
          }}
        >
          <div>
            <input
              type="radio"
              id="name"
              value="name"
              checked={searchedField === 'name'}
              onChange={() => handleRadioChange('name')}
            />
            <label htmlFor="name">
              Name
              <input
                name="name"
                value={searchedEvent.name}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="organiser"
              value="organiser"
              checked={searchedField === 'organiser'}
              onChange={() => handleRadioChange('organiser')}
            />
            <label htmlFor="organiser">
              Organiser
              <input
                name="userId"
                value={searchedEvent.userId}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="category"
              value="category"
              checked={searchedField === 'category'}
              onChange={() => handleRadioChange('category')}
            />
            <label htmlFor="category">
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
          </div>
          <div>
            <input
              type="radio"
              id="location"
              value="location"
              checked={searchedField === 'location'}
              onChange={() => handleRadioChange('location')}
            />
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
          </div>
          <button disabled={isDisabled}>Find event</button>
        </form>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </div>
    </div>
  );
}
