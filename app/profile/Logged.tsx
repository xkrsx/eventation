import Link from 'next/link';
import LogoutButton from '../(auth)/logout/LogoutButton';
import { User } from '../../migrations/00000-createTableUsers';
import ProfileImage from '../common/Images/ProfileImage/ProfileImage';

type Props = {
  profile: User;
};

export default function ProfileLogged(props: Props) {
  return (
    <div className="wrapper">
      <div className="profile">
        <h1>username: {props.profile.username}</h1>
        <h2>full name: {props.profile.fullName}</h2>
        <ProfileImage profile={props.profile} />
        <ul>
          <li>
            <Link href={`/profile/${props.profile.username}`}>
              Public profile
            </Link>
          </li>
          <li>
            <Link href="/profile/edit">Edit profile</Link>
          </li>
          <li>
            <Link href="/profile/settings">Settings</Link>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>
      </div>
    </div>
  );
}
