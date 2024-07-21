'use client';

import { useState } from 'react';

type Props = {
  eventId: number;
};

interface BodyResponse {
  content: string;
  eventId: string;
  error: string;
}

interface ApiResponse {
  content: string;
  eventId: string;
}

export default function ChatInput({ eventId }: Props) {
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    event.preventDefault();

    const response = await fetch('/api/openChat', {
      method: 'POST',
      body: JSON.stringify({
        content: input,
        eventId: eventId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setErrorMessage('');

    if (!response.ok) {
      let newErrorMessage = 'Error creating message';

      try {
        const body: BodyResponse = await response.json();
        newErrorMessage = body.error;
      } catch {}

      setErrorMessage(newErrorMessage);
      return;
    }

    const data: ApiResponse = await response.json();

    setInput('');
    return data;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <input
              style={{ width: '20vw', height: '5vh' }}
              onKeyDown={async (
                event: React.KeyboardEvent<HTMLInputElement>,
              ) => {
                if (event.key === 'Enter') {
                  await handleSubmit(event);
                }
              }}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type in your message"
            />

            <div className="py-2" aria-hidden="true">
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>

            <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
              <div className="flex-shrink-0">
                <button disabled={!input && true}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div>{errorMessage}</div>
    </div>
  );
}
