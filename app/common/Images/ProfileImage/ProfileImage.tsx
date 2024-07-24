'use client';
import { CldImage } from 'next-cloudinary';
import { Event } from '../../../../database/events';
import { User } from '../../../../migrations/00000-createTableUsers';

type Props = {
  profile: Omit<User, 'fullName' | 'categories' | 'email'> | Event;
};

export default function ProfileImage(props: Props) {
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
