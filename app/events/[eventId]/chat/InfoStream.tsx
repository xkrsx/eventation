'use client';

import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { OpenChatMessage } from '../../../../migrations/00004-createTableEventLoungeChats';
import { pusherClient, toPusherKey } from '../../../../util/pusher';
import ChatUsername from '../../../common/Chat/ChatUsername';

type Props = {
  messages: OpenChatMessage[];
  currentUserId: number;
  eventId: number;
};

export default function InfoStream(props: Props) {
  const [messages, setMessages] = useState<OpenChatMessage[]>(props.messages);

  // Scroll down to newest message
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (scrollDownRef.current) {
      scrollDownRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // pusher message subscription
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`event:${props.eventId}`));

    const messageHandler = (message: OpenChatMessage) => {
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
          const isCurrentUser = message.userId === props.currentUserId;
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
                {isCurrentUser ? (
                  <strong>You</strong>
                ) : (
                  <ChatUsername chatUserId={message.userId} />
                )}
                {/* <ChatUsername
                  chatUserId={message.userId}
                  isCurrentUser={isCurrentUser}
                /> */}
              </span>
              {/* <Reactions
                messageId={message.id}
                userId={message.userId}
                // currentReaction={}
              /> */}
              {/* </span> */}
              <div ref={scrollDownRef} />
            </div>
          );
        },
      )}
    </div>
  );
}
