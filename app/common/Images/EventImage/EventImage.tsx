'use client';
import { CldImage } from 'next-cloudinary';
import { Event } from '../../../../database/events';

type Props = {
  event: Event;
};

export default function EventImage(props: Props) {
  if (props.event.image === '') {
    return <div className="event-cover">{props.event.name}</div>;
  }

  return (
    <div className="image-holder">
      <CldImage
        className="event-image"
        width="200"
        height="250"
        src={props.event.image}
        crop="fill"
        sizes="100vw"
        alt={`${props.event.name} event picture`}
      />
    </div>
  );
}
