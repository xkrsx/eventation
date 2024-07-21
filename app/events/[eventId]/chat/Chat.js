'use client';

import * as Ably from 'ably';
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
} from 'ably/react';
import React, { useState } from 'react';

// Connect to Ably using the AblyProvider component and your API key
const client = new Ably.Realtime({ authUrl: '/api/chat' });

export default function Chat() {
  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="get-started">
        <AblyPubSub />
      </ChannelProvider>
    </AblyProvider>
  );
}

function AblyPubSub() {
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useConnectionStateListener('connected', () => {
    console.log('Connected to Ably!');
  });

  // Create a channel called 'get-started' and subscribe to all messages with the name 'first' using the useChannel hook
  const { channel } = useChannel('get-started', 'first', (message) => {
    setMessages((previousMessages) => [...previousMessages, message]);
  });

  return (
    // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
    <div>
      <h2>event lounge</h2>
      {messages.map((message) => {
        return <p key={`message-id-${message.id}`}>{message.data}</p>;
      })}
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label>
          You:{' '}
          <input
            value={chatMessage}
            placeholder="your message..."
            onChange={(event) => setChatMessage(event.target.value)}
          />
        </label>
        <button
          onClick={async () => {
            await channel.publish('first', chatMessage);
          }}
        >
          Publish
        </button>
      </form>
    </div>
  );
}
