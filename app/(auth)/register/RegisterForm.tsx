'use client';

import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import './RegisterForm.scss';
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from '@geoapify/react-geocoder-autocomplete';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import {
  OnAdd,
  OnDelete,
  ReactTags,
  TagSelected,
} from 'react-tag-autocomplete';
import { suggestions } from '../../../database/categories';
import { getSafeReturnToPath } from '../../../util/validation';
import ImageUpload from '../../common/ImageUpload/ImageUpload';
import ErrorMessage from '../../ErrorMessage';
import { RegisterResponseBodyPost } from '../api/register/route';

type Props = { returnTo?: string | string[] };

export default function RegisterForm(props: Props) {
  const [selected, setSelected] = useState<TagSelected[]>([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    location: '',
    latitude: '',
    longitude: '',
    categories: '',
    email: '',
    image: '',
  });
  const [userCategory, setUserCategory] = useState(false);
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const SELECTED_LENGTH = 3;

  // TODO FIX adding categories to the profile
  const onAdd: OnAdd = useCallback(
    (newTag) => {
      setSelected([...selected, newTag]);
      // newCategory = selected.map((category) => category.label);
      // setNewUser({
      //   ...newUser,
      //   ...newUser.categories,
      //   categories: newTag.label,
      // });
    },
    [selected],
  );

  const onDelete: OnDelete = useCallback(
    (index: number) => {
      setSelected(selected.filter((a, i) => i !== index));
    },
    [selected],
  );

  const router = useRouter();

  function addImageUrl(url: string) {
    setNewUser({ ...newUser, image: url });
  }

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

    router.push(
      getSafeReturnToPath(props.returnTo) || `/profile/${data.user.username}`,
    );

    router.refresh();
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
      <div className="registration-form">
        <div className="image-upload">
          <ImageUpload
            buttonText="Upload profile picture"
            options={{
              sources: ['local', 'camera', 'url', 'dropbox', 'google_drive'],
            }}
            addUrlOnUpload={addImageUrl}
            alt={newUser.username}
            uploadType="profile"
          />
        </div>
        <form
          className="form registration"
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
          <label className="location">
            <GeoapifyContext apiKey="4ca7dda985114a55bf51c15172c59328">
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

          <div className="categories">
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={userCategory}
                  onChange={() => setUserCategory(!userCategory)}
                />{' '}
                I want to add my favorite categories (max 3)
              </label>
            </div>

            {userCategory ? (
              <div>
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
                ) : (
                  ''
                )}
                {selected.length > SELECTED_LENGTH ? (
                  <p id="error" style={{ color: '#fd5956' }}>
                    You must remove {selected.length - SELECTED_LENGTH} tags
                  </p>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
          </div>

          <button className="button-action">Register</button>

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
