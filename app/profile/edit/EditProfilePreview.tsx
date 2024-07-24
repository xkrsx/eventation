'use client';
import dayjs from 'dayjs';
import { CldImage } from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User } from '../../../migrations/00000-createTableUsers';
import ProfileImage from '../../common/Images/ProfileImage/ProfileImage';
import ErrorMessage from '../../ErrorMessage';

type Props = {
  profile: User;
};

export default function EditProfilePreview(props: Props) {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  return (
    <div className="wrapper">
      <h1>Edit profile</h1>
      <div className="profile">
        <h1>User: {props.profile.username}</h1>
        <h2>Location: {props.profile.location}</h2>
        <h3>
          Account since: {dayjs(props.profile.createdAt).format('MM/YYYY')}
        </h3>
        <ProfileImage profile={props.profile} />

        <button
          onClick={async () => {
            const response = await fetch(`/api/users/${props.profile.id}`, {
              method: 'DELETE',
            });

            setErrorMessage('');

            if (!response.ok) {
              let newErrorMessage = 'Error deleting the profile.';

              try {
                const body: { error: string } = await response.json();
                newErrorMessage = body.error;
              } catch {
                // Don't fail if response JSON body
                // cannot be parsed
              }

              // TODO: Use toast instead of showing
              // this below creation / update form
              setErrorMessage(newErrorMessage);
              return;
            }

            router.refresh();
          }}
        >
          Delete my profile
        </button>
      </div>
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </div>
  );
}
