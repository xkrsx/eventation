'use client';
import { CldImage } from 'next-cloudinary';
import { Event } from '../../../../database/events';
import { User } from '../../../../migrations/00000-createTableUsers';

type Props = {
  event: Event | User;
};

export default function EventImage(props: Props) {
  return (
    <CldImage
      width="150"
      height="150"
      src={props.event.image}
      crop="fill"
      sizes="100vw"
      alt={`${props.event.name} event picture`}
    />
  );
}
