'use client';
import { useState } from 'react';
import { RegisterResponseBodyPost } from '../../api/register/route';
import ErrorMessage from '../../ErrorMessage';

export default function LoginForm() {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        user,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data: RegisterResponseBodyPost = await response.json();

    if ('errors' in data) {
      setErrors(data.errors);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setErrors([]);

    setUser({
      ...user,
      [event.target.name]: value,
    });
  }

  return (
    <div className="wrapper">
      <div className="register">
        <h1>Login Form</h1>
        <form
          className="form"
          onSubmit={async (event) => {
            // eslint error: no preventDefault() even though there is one in called function
            event.preventDefault();
            await handleLogin(event);
          }}
        >
          <label>
            username
            <input
              required
              name="username"
              value={user.username}
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
              value={user.password}
              onChange={handleChange}
            />
          </label>
          {/* TODO password confirmation */}

          <button>Login</button>

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
