'use client';
import { CldImage } from 'next-cloudinary';
import { User } from '../../../../migrations/00000-createTableUsers';

type Props = {
  profile: Omit<User, 'fullName' | 'categories' | 'email'>;
};

export default function ProfileImage(props: Props) {
  if (props.profile.image === '') {
    return (
      <div
        style={{
          height: '45px',
          width: '45px',
          border: '1px dotted black',
          borderRadius: '50%',
          lineHeight: '45px',
          textAlign: 'center',
        }}
      >
        {props.profile.username.slice(0, 2)}
      </div>
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
