'use client';

import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { InfoStreamMessage } from '../../../../migrations/00005-createTableInfoStream';
import { pusherClient, toPusherKey } from '../../../../util/pusher';
import ChatInput from '../../../common/Chat/ChatInput';
import ChatUsername from '../../../common/Chat/ChatUsername';

type Props = {
  messages: InfoStreamMessage[];
  currentUserId: number;
  eventId: number;
  isOrganiser: boolean | undefined;
};

export default function InfoStream(props: Props) {
  const [messages, setMessages] = useState<InfoStreamMessage[]>(props.messages);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollDownRef.current) {
      scrollDownRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`infoStream:${props.eventId}`));

    const messageHandler = (message: InfoStreamMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    pusherClient.bind('incoming-message', messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`infoStream:${props.eventId}`));
      pusherClient.unbind('incoming-message', messageHandler);
    };
  }, [props.eventId]);

  return (
    <div>
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
                  textAlign: 'right',
                  backgroundColor: 'lightBlue',
                  margin: '10px auto',
                  width: '50vw',
                }}
              >
                <p>{message.content}</p>
                <p>{sendingTime()}</p>
                <span>
                  {isCurrentUser ? (
                    <strong>You</strong>
                  ) : (
                    <ChatUsername chatUserId={message.userId} />
                  )}
                </span>
                <div ref={scrollDownRef} />
              </div>
            );
          },
        )}
      </div>
      {props.isOrganiser && <ChatInput eventId={Number(props.eventId)} />}
    </div>
  );
}
