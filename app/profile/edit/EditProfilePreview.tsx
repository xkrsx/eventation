'use client';

import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from '@geoapify/react-geocoder-autocomplete';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RegisterResponseBodyPost } from '../../(auth)/api/register/route';
import { User } from '../../../migrations/00000-createTableUsers';
import ProfileImage from '../../common/Images/ProfileImage/ProfileImage';
import ImageUpload from '../../common/ImageUpload/ImageUpload';
import ErrorMessage from '../../ErrorMessage';

type Props = {
  profile: User;
};

export default function EditProfilePreview(props: Props) {
  const [editedUser, setEditedUser] = useState({
    id: props.profile.id,
    username: props.profile.username,
    fullName: props.profile.fullName,
    location: props.profile.location,
    latitude: props.profile.latitude,
    longitude: props.profile.longitude,
    email: props.profile.email,
    image: props.profile.image,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  function addImageUrl(url: string) {
    setEditedUser({ ...editedUser, image: url });
  }

  async function handleEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch('/api/users', {
      method: 'PUT',
      body: JSON.stringify(editedUser),
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

    router.refresh();
  }
  // TODO type req object
  function sendGeocoderRequest(value: string, geocoder: any) {
    return geocoder.sendGeocoderRequest(value);
  }

  // TODO type res object
  function sendPlaceDetailsRequest(feature: any, geocoder: any) {
    setEditedUser({
      ...editedUser,
      location: feature.properties.formatted,
      latitude: String(feature.properties.lat),
      longitude: String(feature.properties.lon),
    });
    return geocoder.sendPlaceDetailsRequest(feature);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setErrors([]);

    setEditedUser({
      ...editedUser,
      [event.target.name]: value,
    });
  }

  return (
    <div className="wrapper">
      <div className="profile">
        <h1>Edit profile</h1>
        <div className="profile">
          <h1>User: {props.profile.username}</h1>
          <h2>Location: {props.profile.location}</h2>
          <ProfileImage profile={props.profile} />
          <form
            className="form"
            onSubmit={async (event) => {
              // eslint error: no preventDefault() even though there is one in called function
              event.preventDefault();
              await handleEdit(event);
            }}
          >
            <ImageUpload
              buttonText="Upload profile picture"
              options={{
                sources: ['local', 'facebook', 'instagram', 'camera', 'url'],
              }}
              addUrlOnUpload={addImageUrl}
              alt={editedUser.username}
              uploadType="profile"
            />
            <label>
              username
              <input
                required
                name="username"
                value={editedUser.username}
                onChange={handleChange}
              />
            </label>
            <label>
              full name
              <input
                required
                name="fullName"
                value={editedUser.fullName}
                onChange={handleChange}
              />
            </label>
            <div className="location">
              <GeoapifyContext apiKey="00a9862ac01f454887fc285e220d8460">
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
              Original location: {props.profile.location}
            </div>
            <label>
              e-mail
              <input
                required
                type="email"
                name="email"
                value={editedUser.email}
                onChange={handleChange}
              />
            </label>

            <button>Save changes</button>
            {errors.map((error) => (
              <div className="error" key={`error-${error.message}`}>
                <ErrorMessage>{error.message}</ErrorMessage>
              </div>
            ))}
          </form>

          <button
            onClick={async () => {
              const response = await fetch(`/api/users/${props.profile.id}`, {
                method: 'DELETE',
              });

              setErrorMessage('');

              if (!response.ok) {
                let newErrorMessage = 'Error deleting the profile.';

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
            Delete my profile
          </button>
        </div>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </div>
    </div>
  );
}
