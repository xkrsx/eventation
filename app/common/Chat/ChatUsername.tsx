'use server';

import { CldImage } from 'next-cloudinary';
import { getUserPublicByIdInsecure } from '../../../database/users';

type Props = {
  chatUserId: number;
};

export default async function ChatUsername(props: Props) {
  const chatUsername = await getUserPublicByIdInsecure(props.chatUserId);
  if (!chatUsername?.username) {
    return 'user deleted';
  }
  return (
    <div>
      <CldImage
        width="150"
        height="150"
        src={chatUsername.image}
        crop="fill"
        sizes="100vw"
        alt={`${chatUsername.username} profile picture`}
      />{' '}
      <strong>{chatUsername.username}</strong>
    </div>
  );
}
