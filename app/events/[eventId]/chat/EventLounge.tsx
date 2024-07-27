'use client';

import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { EventLoungeMessage } from '../../../../migrations/00004-createTableEventLounge';
import { pusherClient, toPusherKey } from '../../../../util/pusher';
import ChatInput from '../../../common/Chat/ChatInput';
import ChatUsername from '../../../common/Chat/ChatUsername';

type Props = {
  messages: EventLoungeMessage[];
  currentUserId: number;
  eventId: number;
};

export default function EventLounge(props: Props) {
  const [messages, setMessages] = useState<EventLoungeMessage[]>(
    props.messages,
  );

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollDownRef.current) {
      scrollDownRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`eventLounge:${props.eventId}`));

    const messageHandler = (message: EventLoungeMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    pusherClient.bind('incoming-message', messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`eventLounge:${props.eventId}`));
      pusherClient.unbind('incoming-message', messageHandler);
    };
  }, [props.eventId]);

  return (
    <div>
      <div>
        <div>
          {messages.map((message) => {
            const isCurrentUser = message.userId === props.currentUserId;

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
              <div key={`id-${message.id}`}>
                <div
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
                  <p>{message.content}</p>
                  <p>{sendingTime()}</p>
                  <span>
                    {isCurrentUser ? (
                      <strong>You</strong>
                    ) : (
                      // <ChatUsername chatUserId={message.userId} />
                      'user'
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <ChatInput eventId={Number(props.eventId)} apiRoute="eventLounge" />

        <div ref={scrollDownRef} />
      </div>
    </div>
  );
}
