'use client';
import { AddressAutofill } from '@mapbox/search-js-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ErrorMessage from '../../ErrorMessage';
import { RegisterResponseBodyPost } from '../api/register/route';

export default function RegisterForm() {
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    location: '',
    email: '',
  });
  const [errors, setErrors] = useState<{ message: string }[]>([]);

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
            {/* TODO write password rules */}
            password (one X, one x, one #, one @)
            <input
              required
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
            />
          </label>
          <label>
            {/* TODO write password rules */}
            confirm password
            <input
              required
              type="password"
              name="confirmPassword"
              value={newUser.confirmPassword}
              onChange={handleChange}
            />
          </label>
          {/* TODO password confirmation */}
          <label>
            full name
            <input
              required
              name="fullName"
              value={newUser.fullName}
              onChange={handleChange}
            />
          </label>
          <AddressAutofill
            className="form"
            accessToken="pk.eyJ1Ijoia3J5enlzIiwiYSI6ImNseThyYnJsNDBmeWYycXM3M2tidWJtcXQifQ.by4Renbq_rAvqpOxM_gflg"
          >
            <label>
              street + number
              <input name="address-1" autocomplete="address-line1" />
            </label>
            <label>
              {' '}
              city
              <input name="city" autocomplete="address-level2" />
            </label>
            <label>
              state
              <input name="state" autocomplete="address-level1" />
            </label>
            <label>
              postal code
              <input name="zip" autocomplete="postal-code" />
            </label>
          </AddressAutofill>
          <label>
            location
            <input
              required
              name="location"
              value={newUser.location}
              onChange={handleChange}
            />
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
