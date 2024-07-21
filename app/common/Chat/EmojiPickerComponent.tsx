// 'use client';

// import dynamic from 'next/dynamic';
// import { useEffect, useState } from 'react';
// import { Reaction } from '../../migrations/00004-createTableReactions';
// import { pusherClient } from '../../util/pusher';
// import { toPusherKey } from '../../util/utils';

// type Props = {
//   messageId: number;
//   userId: number;
//   currentReaction: string | null;
// };

// export default function EmojiPickerComponent({
//   messageId,
//   userId,
//   currentReaction,
// }: Props) {
//   const [reaction, setReaction] = useState<string | null>(currentReaction);
//   const [reactions, setReactions] = useState<Reaction[]>([]);
//   const [showPicker, setShowPicker] = useState(false);

//   const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
//     ssr: false,
//   });

//   const handleReaction = async (emoji: string) => {
//     const response = await fetch('/api/reactions', {
//       method: 'POST',
//       body: JSON.stringify({
//         messageId,
//         userId,
//         emoji,
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.ok) {
//       setReaction(emoji);
//       setShowPicker(false);
//     }
//   };

//   useEffect(() => {
//     pusherClient.subscribe(toPusherKey(`message:${messageId}`));

//     const reactionHandler = (emoji: Reaction) => {
//       if (emoji.messageId === messageId) {
//         setReactions((prev) => [...prev, emoji]);
//       }
//     };

//     pusherClient.bind('incoming-reaction', reactionHandler);

//     return () => {
//       pusherClient.unsubscribe(toPusherKey(`message:${messageId}`));
//       pusherClient.unbind('incoming-reaction', reactionHandler);
//     };
//   }, [messageId]);

//   const onEmojiClick = async (emojiObject: Reaction) => {
//     await handleReaction(emojiObject.emoji);
//   };

//   return (
//     <div className="relative flex space-x-2 mt-2">
//       <button
//         className={`p-2 rounded-full h-10 w-10 ${reaction ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
//         onClick={() => setShowPicker((prev) => !prev)}
//       >
//         {reaction || '➕'}
//       </button>

//       {showPicker && (
//         <div className="absolute bottom-12">
//           <EmojiPicker
//             reactionsDefaultOpen={true}
//             onEmojiClick={onEmojiClick}
//           />
//         </div>
//       )}

//       {/* {reactions.length > 0 && (
//         <div className="flex space-x-1">
//           {reactions.map((r) => (
//             <div key={`reactions-${r.id}`}>{r.emoji}</div>
//           ))}
//         </div>
//       )} */}
//     </div>
//   );
// }
