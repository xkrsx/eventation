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

            function calculateTimeElapsed() {
              const messageTime = message.timestamp;
              if (
                Number(dayjs(new Date()).format('ss')) -
                  Number(dayjs(messageTime).format('ss')) <
                10
              ) {
                return 'just now';
              } else {
                const currentTime = new Date();

                const milliDiff = currentTime.getTime() - messageTime.getTime();
                if (Math.floor(milliDiff / 1000 / 60) < 2) {
                  return 'a moment';
                }
                if (Math.floor(milliDiff / 1000 / 60) > 59) {
                  return `${Math.floor(milliDiff / 1000 / 60 / 60)} hours`;
                }
                return `${Math.floor(milliDiff / 1000 / 60)} minutes`;
              }
            }

            return (
              <div
                key={`${message.id}-${Number(message.timestamp)}`}
                className="chat-message"
              >
                <div
                  className={`flex items-end ${isCurrentUser ? 'justify-end' : ''}`}
                >
                  <div
                    className={`flex flex-col p-2 rounded space-y-2 text-base max-w-fit mx-2 grow ${isCurrentUser ? 'order-1 items-end' : 'order-2 items-start'}`}
                  >
                    <span
                      className={`px-4 py-2 rounded-lg inline-block
                      ${isCurrentUser ? 'bg-red-900 text-white' : 'bg-zinc-800 text-white'}
                      ${!hasNextMessageFromSameUser && isCurrentUser ? 'rounded-br-none' : ''}
                      ${!hasNextMessageFromSameUser && !isCurrentUser ? 'rounded-bl-none' : ''}`}
                    >
                      {message.content}{' '}
                      <span className="ml-2 text-xs text-gray-400">
                        {calculateTimeElapsed()}
                      </span>
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
              </div>
            );
          })}
          <div ref={scrollDownRef} />
        </div>
      </div>
    </div>
  );
}
