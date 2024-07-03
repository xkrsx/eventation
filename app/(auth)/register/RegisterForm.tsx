'use client';
import { useState } from 'react';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('data: ', data);
  }

  return (
    <div className="wrapper">
      <div>Register Form</div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await handleRegister(event);
        }}
      >
        <label>
          username
          <input
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
        </label>

        <label>
          password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </label>
        <button>Register</button>
      </form>
    </div>
  );
}
