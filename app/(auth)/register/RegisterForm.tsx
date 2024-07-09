'use client';

import '@geoapify/geocoder-autocomplete/styles/minimal.css';
// import './RegisterForm.scss';
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from '@geoapify/react-geocoder-autocomplete';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
// import { ReactTags } from 'react-tag-autocomplete';
// import { categories, suggestions } from '../../../database/categories';
import ErrorMessage from '../../ErrorMessage';
import { RegisterResponseBodyPost } from '../api/register/route';

export default function RegisterForm() {
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    location: '',
    latitude: '',
    longitude: '',
    categories: [],
    email: '',
  });
  const [userLocation, setUserLocation] = useState(false);
  const [selected, setSelected] = useState([]);
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const SELECTED_LENGTH = 3;

  // TODO FIX newTag typing
  const onAdd = useCallback(
    (newTag: never) => {
      setSelected([...selected, newTag]);
      setNewUser({ ...newUser, categories: selected });
    },
    [selected],
  );

  const onDelete = useCallback(
    (index: number) => {
      setSelected(selected.filter((_, i) => i !== index));
      setNewUser({ ...newUser, categories: selected });
    },
    [selected],
  );

  const router = useRouter();

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        newUser,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data: RegisterResponseBodyPost = await response.json();

    if ('errors' in data) {
      setErrors(data.errors);
      return;
    }
    router.push(`/profile/${data.user.username}`);
  }
  // TODO type req object
  function sendGeocoderRequest(value: string, geocoder: any) {
    return geocoder.sendGeocoderRequest(value);
  }

  // TODO type res object
  function sendPlaceDetailsRequest(feature: any, geocoder: any) {
    setNewUser({
      ...newUser,
      location: feature.properties.formatted,
      latitude: String(feature.properties.lat),
      longitude: String(feature.properties.lon),
    });
    return geocoder.sendPlaceDetailsRequest(feature);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setErrors([]);

    setNewUser({
      ...newUser,
      [event.target.name]: value,
    });
  }

  return (
    <div className="wrapper">
      <div className="register">
        <h1>Register</h1>
        <form
          className="form"
          onSubmit={async (event) => {
            // eslint error: no preventDefault() even though there is one in called function
            event.preventDefault();
            await handleRegister(event);
          }}
        >
          <label>
            username
            <input
              required
              name="username"
              value={newUser.username}
              onChange={handleChange}
            />
          </label>
          <label>
            password
            <input
              required
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
            />
          </label>
          <label>
            confirm password
            <input
              required
              type="password"
              name="confirmPassword"
              value={newUser.confirmPassword}
              onChange={handleChange}
            />
          </label>
          <label>
            full name
            <input
              required
              name="fullName"
              value={newUser.fullName}
              onChange={handleChange}
            />
          </label>
          <div className="location">
            <div>
              <input
                type="checkbox"
                checked={userLocation}
                onChange={() => setUserLocation(!userLocation)}
              />{' '}
              I want to add my default location for events (city or country)
            </div>
            <label>
              {userLocation ? (
                <div>
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
                </div>
              ) : null}
            </label>
          </div>
          <label>
            e-mail
            <input
              required
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
            />
          </label>
          {/* favorite categories (max 3)
          <ReactTags
            id="category-selector"
            labelText="Select selected"
            isInvalid={selected.length >= SELECTED_LENGTH}
            onAdd={onAdd}
            onDelete={onDelete}
            selected={selected}
            suggestions={suggestions}
          />
          {selected.length < SELECTED_LENGTH ? (
            <p id="error" style={{ color: '#fd5956' }}>
              You can select {SELECTED_LENGTH - selected.length} more tags
            </p>
          ) : null}
          {selected.length > SELECTED_LENGTH ? (
            <p id="error" style={{ color: '#fd5956' }}>
              You must remove {selected.length - SELECTED_LENGTH} tags
            </p>
          ) : null} */}
          <button>Register</button>
          {errors.map((error) => (
            <div className="error" key={`error-${error.message}`}>
              <ErrorMessage>{error.message}</ErrorMessage>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}
