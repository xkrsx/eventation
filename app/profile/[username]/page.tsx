import { redirect } from 'next/navigation';
import { getUserPublicInsecure } from '../../../database/users';

type Props = {
  params: {
    username: string;
  };
};
// when logged in/out: public profile
export default async function UserProfile(props: Props) {
  const profile = await getUserPublicInsecure(props.params.username);
  if (profile) {
    return (
      <div className="wrapper">
        <div className="profile">
          <h1>User: {profile.username}</h1>
          <h2>Location: {profile.location}</h2>
          <h3>Account since: {String(profile.createdAt)}</h3>
        </div>
      </div>
    );
  } else {
    redirect('/');
  }
}
