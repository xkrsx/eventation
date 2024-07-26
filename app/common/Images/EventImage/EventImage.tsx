'use client';
import { CldImage } from 'next-cloudinary';
import { Event } from '../../../../database/events';

type Props = {
  event: Event;
};

export default function EventImage(props: Props) {
  if (props.event.image === '') {
    return (
      <div
        style={{
          height: '45px',
          width: '100px',
          border: '1px dotted black',
          borderRadius: '5px',
          lineHeight: '45px',
          textAlign: 'center',
        }}
      >
        {props.event.name}
      </div>
    );
  }

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
