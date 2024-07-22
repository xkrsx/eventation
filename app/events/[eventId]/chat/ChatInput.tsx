'use client';

import { useState } from 'react';

type Props = {
  eventId: number;
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

    const response = await fetch('/api/eventLounge', {
      method: 'POST',
      body: JSON.stringify({
        content: input,
        eventId: props.eventId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setErrorMessage('');

    if (!response.ok) {
      let newErrorMessage = 'Error creating message';

      try {
        const body: { error: string } = await response.json();
        newErrorMessage = body.error;
      } catch {}

      setErrorMessage(newErrorMessage);
      return;
    }

    // const data = await response.json();

    return setInput('');
    // return data;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            style={{ width: '20vw', height: '5vh' }}
            onKeyDown={async (event) => {
              if (event.key === 'Enter') {
                await handleSubmit(event);
              }
            }}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="your message..."
          />

          <button disabled={!input && true}>Send</button>
        </div>
      </form>

      <div>{errorMessage}</div>
    </div>
  );
}
