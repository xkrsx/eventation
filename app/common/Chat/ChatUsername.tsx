'use server';

import { getUserPublicByIdInsecure } from '../../../database/users';

type Props = {
  chatUserId: number;
};

export default async function ChatUsername(props: Props) {
  const chatUsername = await getUserPublicByIdInsecure(props.chatUserId);
  if (!chatUsername?.username) {
    return 'user deleted';
  }
  return <strong>{chatUsername.username}</strong>;
}
