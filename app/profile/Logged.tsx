import './Logged.scss';
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
        <div className="image-info">
          <div className="user-image">
            <Link href={`/profile/${props.profile.username}`}>
              <ProfileImage profile={props.profile} />
            </Link>
          </div>
          <div className="info-actions">
            <div className="profile-info">
              <h1>username: {props.profile.username}</h1>
              <h2>full name: {props.profile.fullName}</h2>
            </div>
            <div className="profile-actions">
              <div>
                <ul>
                  <li>
                    <Link href={`/profile/${props.profile.username}`}>
                      See your public profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile/edit">Edit your profile</Link>
                  </li>
                </ul>
              </div>
              <div className="logout">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
