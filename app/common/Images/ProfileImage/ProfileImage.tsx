'use client';
import './ProfileImage.scss';
import { CldImage } from 'next-cloudinary';
import { User } from '../../../../migrations/00000-createTableUsers';

type Props = {
  profile: Omit<User, 'fullName' | 'categories' | 'email'>;
};

export default function ProfileImage(props: Props) {
  if (props.profile.image === '') {
    return (
      <div className="user-avatar">{props.profile.username.slice(0, 1)}</div>
    );
  }
  return (
    <CldImage
      width="150"
      height="150"
      src={props.profile.image}
      crop="fill"
      sizes="100vw"
      alt={`${props.profile.username} profile picture`}
    />
  );
}
