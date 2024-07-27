'use client';

import { useState } from 'react';
import ErrorMessage from '../../ErrorMessage';

type Props = {
  eventId: number;
  apiRoute: string;
  username: string;
};

type NewMessageBodyResponse = {
  content: string;
  eventId: string;
  error: string;
};

type NewMessageApiResponse = {
  content: string;
  eventId: string;
};

export default function ChatInput(props: Props) {
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    event.preventDefault();

    const response = await fetch(`/api/${props.apiRoute}`, {
      method: 'POST',
      body: JSON.stringify({
        content: input,
        eventId: props.eventId,
        username: props.username,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setErrorMessage('');

    if (!response.ok) {
      let newErrorMessage = 'Error creating message';

      try {
        const body: NewMessageBodyResponse = await response.json();
        newErrorMessage = body.error;
      } catch {}

      setErrorMessage(newErrorMessage);
      return;
    }

    const data: NewMessageApiResponse = await response.json();

    setInput('');
    return data;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            style={{ width: '20vw', height: '5vh' }}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="your message..."
          />

          <button disabled={!input && true}>Send</button>
        </div>
      </form>

      <ErrorMessage>{errorMessage}</ErrorMessage>
    </div>
  );
}
