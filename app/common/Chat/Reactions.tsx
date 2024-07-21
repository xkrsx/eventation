'use client';

import { useEffect, useState } from 'react';
import { OpenChatReaction } from '../../../migrations/00005-createTableOpenChatReactions';
import { pusherClient, toPusherKey } from '../../../util/pusher';

type Props = {
  messageId: number;
  userId: number;
  currentReaction: string | null;
};

export default function Reactions({
  messageId,
  userId,
  currentReaction,
}: Props) {
  const [reaction, setReaction] = useState<string | null>(currentReaction);

  const handleReaction = async (emoji: string) => {
    const response = await fetch('/api/openChat/reactions', {
      method: 'POST',
      body: JSON.stringify({
        messageId,
        userId,
        emoji,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      setReaction(emoji);
    }
  };

  // Use Pusher for real-time functionality:
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`message:${messageId}`));

    const reactionHandler = (reactions: OpenChatReaction) => {
      if (reactions.messageId === messageId) {
        setReaction(reactions.emoji);
      }
    };

    pusherClient.bind('incoming-reaction', reactionHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`message:${messageId}`));
      pusherClient.unbind('incoming-reaction', reactionHandler);
    };
  }, [messageId]);

  return (
    <div className="flex space-x-2 mt-2">
      {!reaction ? (
        <>
          <button
            className={`p-2 rounded-full h-10 w-10 ${reaction === '👍' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            onClick={() => handleReaction('👍')}
          >
            👍
          </button>
          <button
            className={`p-2 rounded-full h-10 w-10 ${reaction === '👎' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            onClick={() => handleReaction('👎')}
          >
            👎
          </button>
        </>
      ) : (
        <p className="flex items-center justify-center p-2 rounded-full h-10 w-10 bg-blue-500">
          {reaction}
        </p>
      )}
    </div>
  );
}
