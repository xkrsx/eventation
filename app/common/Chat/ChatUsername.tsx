'use server';

import { getUserPublicByIdInsecure } from '../../../database/users';
import ProfileImage from '../Images/ProfileImage/ProfileImage';

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
      <ProfileImage profile={chatUsername} />
      <strong>{chatUsername.username}</strong>
    </div>
  );
}
