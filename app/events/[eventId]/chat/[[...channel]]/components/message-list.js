// import { EllipsisVertical } from 'lucide-react';
// // import { Avatar, AvatarImage } from "@/components/ui/avatar"
// import {
//   Menubar,
//   MenubarContent,
//   MenubarItem,
//   MenubarMenu,
//   MenubarTrigger,
// } from "@/components/ui/menubar"

import Image from 'next/image';

const userCanDelete = (message, user) => {
  return user.publicMetadata.isMod || message.clientId === user.id;
};

const MessageList = ({ messages, user, onDelete }) => {
  const createLi = (message) => (
    <li
      key={`key-${message.id}`}
      className="flex justify-between bg-slate-50 p-3 my-2 group"
    >
      <div className="flex items-center">
        <div className="mr-2">
          <Image src={message.data.avatarUrl} />
        </div>
        <p>{message.data.text}</p>
      </div>

      <button
        disabled={!userCanDelete(message, user)}
        onClick={() => onDelete(message.extras.timeserial)}
      >
        Delete
      </button>
    </li>
  );

  return <ul> {messages.map(createLi)} </ul>;
};
export default MessageList;
