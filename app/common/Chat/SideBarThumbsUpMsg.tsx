'use client';

import { useEffect, useState } from 'react';
import { OpenChatMessageWithUsernameAndReaction } from '../../../migrations/00004-createTableOpenChats';
import { pusherClient, toPusherKey } from '../../../util/pusher';

type Props = {
  params: OpenChatMessageWithUsernameAndReaction[];
  eventId: number;
};

export default function SideBarThumbsUpMsg({ params, eventId }: Props) {
  const [messages, setMessages] =
    useState<OpenChatMessageWithUsernameAndReaction[]>(params);

  // Use Pusher for real-time functionality:
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`game:${eventId}`));

    const messageHandler = (
      message: OpenChatMessageWithUsernameAndReaction,
    ) => {
      if (message.emoji === '👍') {
        setMessages((prev) => [...prev, message]);
      }
    };

    pusherClient.bind('incoming-message', messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`game:${eventId}`));
      pusherClient.unbind('incoming-message', messageHandler);
    };
  }, [eventId]);

  return (
    <div className="drawer drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        Page content here
        <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">
          Open filtered messages
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {messages.map((message) =>
            message.emoji === '👍' ? (
              <li key={`messages-${message.id}`}>{message.content}</li>
            ) : null,
          )}
        </ul>
      </div>
    </div>
  );
}

// import { getMessagesInsecure } from '../../database/messages';

// type Props = {
//   eventId: number;
// };

// export default async function SideBarThumbsUpMsg({ eventId }: Props) {
//   const messageWithThumbsUp = await getMessagesInsecure(eventId);

//   return (
//     <div className="flex items-end">
//       <h1 className="text-white">Messages with Thumbs ups</h1>
//       <div className="flex flex-col p-2 rounded space-y-2 text-base max-w-xs mx-2">
//         <div className="px-4 py-2 rounded-lg inline-block bg-gray-200 text-gray-900">
//           {messageWithThumbsUp.map(
//             (message) =>
//               message.emoji === '👍' && (
//                 <div key={`messages-${message.id}`}>{message.content}</div>
//               ),
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
