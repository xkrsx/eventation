'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSafeReturnToPath } from '../../../util/validation';
import ErrorMessage from '../../ErrorMessage';
import { LoginResponseBodyPost } from '../api/login/route';

type Props = { returnTo?: string | string[] };

export default function LoginForm(props: Props) {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

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
    const data: LoginResponseBodyPost = await response.json();

    if ('errors' in data) {
      setErrors(data.errors);
      return;
    }

    router.push(
      getSafeReturnToPath(props.returnTo) || `/profile/${data.user.username}`,
    );

    router.refresh();
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
        <h1>Login</h1>
        <form
          className="form"
          onSubmit={async (event) => {
            // eslint error: no preventDefault() even though there is one in called function
            event.preventDefault();
            await handleLogin(event);
          }}
        >
          <label>
            username{' '}
            <input
              required
              name="username"
              value={user.username}
              onChange={handleChange}
            />
          </label>

          <label>
            password{' '}
            <input
              required
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
            />
          </label>

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
