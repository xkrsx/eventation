'use client';

import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { OpenChatMessageWithUsernameAndReaction } from '../../../../migrations/00004-createTableOpenChats';
import { pusherClient, toPusherKey } from '../../../../util/pusher';
import Reactions from '../../../common/Chat/Reactions';

type Props = {
  params: OpenChatMessageWithUsernameAndReaction[];
  userId: number;
  eventId: number;
};

export default function Chat({ params, userId, eventId }: Props) {
  const [messages, setMessages] =
    useState<OpenChatMessageWithUsernameAndReaction[]>(params);

  // Scroll down to the new message
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  // Scroll to the bottom when messages change
  useEffect(() => {
    if (scrollDownRef.current) {
      scrollDownRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Use Pusher for real-time functionality:
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`event:${eventId}`));

    const messageHandler = (
      message: OpenChatMessageWithUsernameAndReaction,
    ) => {
      setMessages((prev) => [...prev, message]);
    };

    pusherClient.bind('incoming-message', messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`event:${eventId}`));
      pusherClient.unbind('incoming-message', messageHandler);
    };
  }, [eventId]);

  return (
    <div>
      <div className="flex flex-1 flex-col-reverse overflow-y-auto">
        <div id="messages" className="flex flex-col space-y-1 p-3">
          {messages.map((message, index: number) => {
            const isCurrentUser = message.userId === userId;
            const hasNextMessageFromSameUser =
              messages[index - 1]?.userId === messages[index]?.userId; // Check if there is a same message from the same user

            function sendingTime() {
              if (dayjs(new Date()).diff(message.timestamp, 'minute') < 2) {
                return 'just a moment ago';
              }
              if (dayjs(new Date()).diff(message.timestamp, 'minute') < 59) {
                return `${dayjs(new Date()).diff(message.timestamp, 'minute')} minutes ago`;
              }
              if (dayjs(new Date()).diff(message.timestamp, 'minute') > 59) {
                return `${dayjs(new Date()).diff(message.timestamp, 'hour')} hour(s) ago`;
              }
            }

            return (
              <div key={`id-${message.id}`}>
                <div
                  style={{
                    border: '1px solid black',
                    borderRadius: '10px',
                    padding: '3px',
                    textAlign: isCurrentUser ? 'right' : 'left',
                    backgroundColor: isCurrentUser ? 'lightBlue' : 'white',
                  }}
                >
                  <span
                    style={
                      {
                        // (!hasNextMessageFromSameUser && isCurrentUser) ? '' : '',
                        // (!hasNextMessageFromSameUser && !isCurrentUser) ? '' : ''
                      }
                    }
                  >
                    {message.content}
                    {' | '}
                    {sendingTime()}
                    <p className="text-xs text-gray-400">
                      {message.userId === userId
                        ? 'You'
                        : message.username
                          ? message.username.charAt(0).toUpperCase() +
                            message.username.slice(1)
                          : ''}
                    </p>
                    <Reactions
                      messageId={message.id}
                      userId={message.userId}
                      currentReaction={message.emoji}
                    />
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={scrollDownRef} />
        </div>
      </div>
    </div>
  );
}
