'use client';
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from '@geoapify/react-geocoder-autocomplete';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react';
import { categoriesObject } from '../../../database/categories';
import { EventResponseBodyPost } from '../../api/events/route';
import ErrorMessage from '../../ErrorMessage';

type FormFields = {
  name: string;
  organiser: string;
  location: string;
  category: string;
};

export default function FindEventCccurateForm() {
  const [selectedField, setSelectedField] = useState<keyof FormFields>('name');
  const [formFields, setFormFields] = useState<FormFields>({
    name: '',
    organiser: '',
    category: 'Activism / Politics',
    location: '',
  });

  console.log('selectedField: ', selectedField);
  console.log('formFields: ', formFields);
  const [isDisabled, setIsDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedField(e.target.value as keyof FormFields);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setErrorMessage('');
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };
  const categories = categoriesObject;

  function sendGeocoderRequest(value: string, geocoder: any) {
    return geocoder.sendGeocoderRequest(value);
  }

  function sendPlaceDetailsRequest(feature: any, geocoder: any) {
    setFormFields({
      ...formFields,
      location: feature.properties.formatted,
    });
    return geocoder.sendPlaceDetailsRequest(feature);
  }

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch('/api/events/findAccurate', {
      method: 'POST',
      body: JSON.stringify({
        field: selectedField,
        query: formFields[selectedField],
      }),
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
        <form onSubmit={handleSearch}>
          <div>
            <label>
              <input
                type="radio"
                name="selectedField"
                value="name"
                checked={selectedField === 'name'}
                onChange={handleRadioChange}
              />
              Name
              <label>
                Name:
                <input
                  name="name"
                  value={formFields.name}
                  onChange={handleInputChange}
                />
              </label>
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="selectedField"
                value="organiser"
                checked={selectedField === 'organiser'}
                onChange={handleRadioChange}
              />
              Organiser
              <label>
                Organiser:
                <input
                  name="organiser"
                  value={formFields.organiser}
                  onChange={handleInputChange}
                />
              </label>
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="selectedField"
                value="category"
                checked={selectedField === 'category'}
                onChange={handleRadioChange}
              />
              Category
              <label>
                <select name="category" onChange={handleInputChange}>
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
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="selectedField"
                value="location"
                checked={selectedField === 'location'}
                onChange={handleRadioChange}
              />
              <label htmlFor="location">
                Location:
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
            </label>
          </div>
          <button disabled={isDisabled}>Find event</button>
        </form>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </div>
    </div>
  );
}
