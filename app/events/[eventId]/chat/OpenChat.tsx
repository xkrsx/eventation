'use client';

import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { OpenChatMessageWithUsernameAndReaction } from '../../../../migrations/00004-createTableOpenChats';
import { pusherClient, toPusherKey } from '../../../../util/pusher';
import Reactions from '../../../common/Chat/Reactions';

type Props = {
  messages: OpenChatMessageWithUsernameAndReaction[];
  userId: number;
  eventId: number;
};

export default function OpenChat(props: Props) {
  const [messages, setMessages] = useState<
    OpenChatMessageWithUsernameAndReaction[]
  >(props.messages);

  console.log('messages: ', messages);

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
    pusherClient.subscribe(toPusherKey(`event:${props.eventId}`));

    const messageHandler = (
      message: OpenChatMessageWithUsernameAndReaction,
    ) => {
      setMessages((prev) => [...prev, message]);
    };

    pusherClient.bind('incoming-message', messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`event:${props.eventId}`));
      pusherClient.unbind('incoming-message', messageHandler);
    };
  }, [props.eventId]);

  return (
    <div>
      {messages.map(
        (
          message,
          // index: number
        ) => {
          const isCurrentUser = message.userId === props.userId;
          // const hasNextMessageFromSameUser =
          //   messages[index - 1]?.userId === messages[index]?.userId; // Check if there is a same message from the same user

          function sendingTime() {
            if (dayjs(new Date()).diff(message.timestamp, 'minute') < 2) {
              return 'just a moment ago';
            }
            if (dayjs(new Date()).diff(message.timestamp, 'minute') < 59) {
              return `${dayjs(new Date()).diff(message.timestamp, 'minute')} minutes ago`;
            }
            if (dayjs(new Date()).diff(message.timestamp, 'minute') > 59) {
              return `over an hour ago`;
            }
            if (dayjs(new Date()).diff(message.timestamp, 'minute') > 119) {
              return dayjs(message.timestamp).format('HH:mm');
            }
          }

          return (
            <div
              key={`id-${message.id}`}
              style={{
                border: '1px solid black',
                borderRadius: '10px',
                padding: '3px',
                textAlign: isCurrentUser ? 'right' : 'left',
                backgroundColor: isCurrentUser ? 'lightBlue' : 'white',
                margin: '10px',
                marginRight: isCurrentUser ? '10px' : 'auto',
                marginLeft: isCurrentUser ? 'auto' : '10px',
                width: '50vw',
              }}
            >
              {/* <span
              style={
                {
                  // (!hasNextMessageFromSameUser && isCurrentUser) ? '' : '',
                  // (!hasNextMessageFromSameUser && !isCurrentUser) ? '' : ''
                }
              }
            > */}
              <p>{message.content}</p>
              <p>{sendingTime()}</p>
              <span>
                <strong>
                  {message.userId === props.userId ? 'You' : message.username}
                </strong>
              </span>
              <Reactions
                messageId={message.id}
                userId={message.userId}
                currentReaction={message.emoji}
              />
              {/* </span> */}
            </div>
          );
        },
      )}
    </div>
  );
}
